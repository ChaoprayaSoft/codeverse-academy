const admin = require("firebase-admin");
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = "1049203742621-85p09ruvq6kr2m1bnu1kg933ajhbjen3.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const COURSE_REWARDS = {
    explorer: { level: 20, course: 250, totalLevels: 5 },
    navigator: { level: 25, course: 500, totalLevels: 6 },
    commander: { level: 30, course: 400, totalLevels: 5 },
    architect: { level: 40, course: 500, totalLevels: 12 },
    data_analytic: { level: 20, course: 300, totalLevels: 10 },
    ai_ml: { level: 15, course: 500, totalLevels: 20 },
    vision: { level: 50, course: 250, totalLevels: 15 },
    prompt_eng: { level: 30, course: 500, totalLevels: 10 },
    robotics: { level: 50, course: 500, totalLevels: 20 }
};

if (!admin.apps.length) {
  let cert;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      cert = admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
    } catch (err) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT", err);
    }
  }

  admin.initializeApp({
    credential: cert || admin.credential.applicationDefault(),
    projectId: "codeverse-1a8ec"
  });
}
const db = admin.firestore();

module.exports = async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Expecting Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  let payload;
  try {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired Google token' });
  }

  // The true email of the logged in user
  const userEmail = String(payload.email).toLowerCase().trim();
  const userName = payload.name;
  const userPicture = payload.picture;

  let data = {};
  if (req.body) {
      data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  
  // If it's a GET request for logout ping, handle it from query params
  if (req.method === 'GET') {
      data.action = req.query.action;
  }

  const action = data.action;

  try {
    // Check if user is permanently blocked
    const blockedRef = db.collection("blocked_emails").doc(userEmail);
    const blockedSnap = await blockedRef.get();
    if (blockedSnap.exists) {
       return res.status(403).json({ status: 'error', message: 'This email has been permanently blocked from accessing CodeVerse.' });
    }

    const docRef = db.collection("users").doc(userEmail);
    const docSnap = await docRef.get();

    if (action === 'load') {
      if (docSnap.exists) {
        const userData = docSnap.data();
        return res.status(200).json({
          status: 'success',
          message: 'Loaded',
          name: userData.name,
          avatar: userData.avatar,
          color: userData.color,
          role: userData.role,
          progress: userData.progress
        });
      }
      return res.status(200).json({ status: 'new_user', message: 'No progress found' });
    }

    if (action === 'getUsers') {
      // Check if user is an Admin securely
      if (!docSnap.exists || docSnap.data().role !== 'Admin') {
         return res.status(403).json({ status: 'error', message: 'Unauthorized: Admins only' });
      }
      
      const querySnapshot = await db.collection("users").get();
      const users = [];
      querySnapshot.forEach((d) => {
          users.push(d.data());
      });
      return res.status(200).json({ status: 'success', message: 'Users fetched', users });
    }

    if (action === 'removeUser') {
      if (!docSnap.exists || docSnap.data().role !== 'Admin') {
         return res.status(403).json({ status: 'error', message: 'Unauthorized: Admins only' });
      }
      if (!data.targetEmail) {
         return res.status(400).json({ status: 'error', message: 'Missing targetEmail' });
      }
      
      // 1. Add to blocked_emails collection
      await db.collection("blocked_emails").doc(data.targetEmail).set({
          blockedAt: new Date().toISOString(),
          blockedBy: userEmail
      });
      
      // 2. Delete the user document entirely
      await db.collection("users").doc(data.targetEmail).delete();
      
      return res.status(200).json({ status: 'success', message: 'User permanently removed and blocked' });
    }

    if (action === 'advanceLevel') {
      const { courseKey, newLevel } = data;
      const courseInfo = COURSE_REWARDS[courseKey];
      if (!courseInfo) return res.status(400).json({ status: 'error', message: 'Invalid course' });
      
      let progress = docSnap.exists && docSnap.data().progress ? docSnap.data().progress : {};
      if (!progress.levels) progress.levels = {};
      if (!progress.missions) progress.missions = {};
      if (!progress.xp) progress.xp = 0;
      if (!progress.badges) progress.badges = [];
      
      const currentLevel = progress.levels[courseKey] || 1;
      
      if (newLevel > currentLevel && newLevel <= courseInfo.totalLevels + 1) {
          const levelsGained = newLevel - currentLevel;
          progress.xp += (levelsGained * courseInfo.level);
          progress.levels[courseKey] = newLevel;
          
          await docRef.set({ progress, lastUpdated: new Date().toISOString() }, { merge: true });
          return res.status(200).json({ status: 'success', progress });
      }
      return res.status(200).json({ status: 'success', progress, message: 'No XP granted (already completed)' });
    }

    if (action === 'completeCourse') {
      const { courseKey } = data;
      const courseInfo = COURSE_REWARDS[courseKey];
      if (!courseInfo) return res.status(400).json({ status: 'error', message: 'Invalid course' });
      
      let progress = docSnap.exists && docSnap.data().progress ? docSnap.data().progress : {};
      if (!progress.missions) progress.missions = {};
      if (!progress.xp) progress.xp = 0;
      if (!progress.badges) progress.badges = [];
      if (!progress.levels) progress.levels = {};
      
      if (!progress.missions[courseKey]) {
          progress.missions[courseKey] = true;
          progress.xp += courseInfo.course;
          
          const badgeName = courseKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + " Wings";
          if (!progress.badges.includes(badgeName)) {
              progress.badges.push(badgeName);
          }
          
          await docRef.set({ progress, lastUpdated: new Date().toISOString() }, { merge: true });
          return res.status(200).json({ status: 'success', progress });
      }
      return res.status(200).json({ status: 'success', progress, message: 'Course already completed' });
    }

    if (action === 'sync' || action === 'login' || action === 'logout') {
      // Secure Fix: Server acts as authority. Ignore client progress overrides.
      const progressToSave = docSnap.exists && docSnap.data().progress ? docSnap.data().progress : {};
      const statusStr = action === 'login' ? 'Online' : (action === 'logout' ? 'Offline' : 'Active');
      
      // Merge with existing data so we don't accidentally downgrade their role if the client tried to set it to 'Student'
      const existingData = docSnap.exists ? docSnap.data() : {};
      const newUserData = {
        email: userEmail,
        name: data.name || existingData.name || userName,
        avatar: data.avatar || existingData.avatar || userPicture,
        color: data.color || existingData.color || "",
        // Role cannot be changed by the client unless they are a new user. 
        role: existingData.role ? existingData.role : (data.role || "Student"),
        progress: progressToSave,
        lastUpdated: new Date().toISOString(),
        status: statusStr
      };

      await docRef.set(newUserData, { merge: true });
      return res.status(200).json({ status: 'success', message: 'Synchronized' });
    }

    return res.status(400).json({ status: 'error', message: 'Unknown action' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
