const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs } = require("firebase/firestore");
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

const firebaseConfig = {
  apiKey: "AIzaSyCNMpcfZJUSQpHGIvqVc0QE2lCjP-i2fg0",
  authDomain: "codeverse-1a8ec.firebaseapp.com",
  projectId: "codeverse-1a8ec",
  storageBucket: "codeverse-1a8ec.firebasestorage.app",
  messagingSenderId: "722458959167",
  appId: "1:722458959167:web:04381efd7a05b99eaac78a",
  measurementId: "G-74N5JK9DZQ"
};

let app;
let db;

function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

module.exports = async function handler(req, res) {
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

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: token, audience: CLIENT_ID });
    payload = ticket.getPayload();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired Google token' });
  }

  const userEmail = String(payload.email).toLowerCase().trim();
  const userName = payload.name;
  const userPicture = payload.picture;

  let data = {};
  if (req.body) {
      data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  if (req.method === 'GET') {
      data.action = req.query.action;
  }

  const db = initFirebase();
  const action = data.action;

  try {

    const blockedRef = doc(db, "blocked_emails", userEmail);
    const blockedSnap = await getDoc(blockedRef);
    if (blockedSnap.exists()) {
       return res.status(403).json({ status: 'error', message: 'Blocked' });
    }

    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);

    if (action === 'load') {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        return res.status(200).json({
          status: 'success',
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
      if (!docSnap.exists() || docSnap.data().role !== 'Admin') {
         return res.status(403).json({ status: 'error', message: 'Unauthorized: Admins only' });
      }
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = [];
      querySnapshot.forEach((d) => users.push(d.data()));
      return res.status(200).json({ status: 'success', users });
    }

    if (action === 'removeUser') {
      if (!docSnap.exists() || docSnap.data().role !== 'Admin') {
         return res.status(403).json({ status: 'error', message: 'Unauthorized: Admins only' });
      }
      if (!data.targetEmail) return res.status(400).json({ status: 'error' });
      
      await setDoc(doc(db, "blocked_emails", data.targetEmail), {
          blockedAt: new Date().toISOString(),
          blockedBy: userEmail
      });
      await deleteDoc(doc(db, "users", data.targetEmail));
      return res.status(200).json({ status: 'success' });
    }

    if (action === 'advanceLevel') {
      const { courseKey, newLevel } = data;
      const courseInfo = COURSE_REWARDS[courseKey];
      if (!courseInfo) return res.status(400).json({ status: 'error' });
      
      let progress = docSnap.exists() && docSnap.data().progress ? docSnap.data().progress : {};
      if (!progress.levels) progress.levels = {};
      if (!progress.missions) progress.missions = {};
      if (!progress.xp) progress.xp = 0;
      if (!progress.badges) progress.badges = [];
      
      const currentLevel = progress.levels[courseKey] || 1;
      
      if (newLevel > currentLevel && newLevel <= courseInfo.totalLevels + 1) {
          progress.xp += ((newLevel - currentLevel) * courseInfo.level);
          progress.levels[courseKey] = newLevel;
          await setDoc(docRef, { progress, lastUpdated: new Date().toISOString() }, { merge: true });
      }
      return res.status(200).json({ status: 'success', progress });
    }

    if (action === 'completeCourse') {
      const { courseKey } = data;
      const courseInfo = COURSE_REWARDS[courseKey];
      if (!courseInfo) return res.status(400).json({ status: 'error' });
      
      let progress = docSnap.exists() && docSnap.data().progress ? docSnap.data().progress : {};
      if (!progress.missions) progress.missions = {};
      if (!progress.xp) progress.xp = 0;
      if (!progress.badges) progress.badges = [];
      if (!progress.levels) progress.levels = {};
      
      if (!progress.missions[courseKey]) {
          progress.missions[courseKey] = true;
          progress.xp += courseInfo.course;
          const badgeName = courseKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + " Wings";
          if (!progress.badges.includes(badgeName)) progress.badges.push(badgeName);
          await setDoc(docRef, { progress, lastUpdated: new Date().toISOString() }, { merge: true });
      }
      return res.status(200).json({ status: 'success', progress });
    }

    if (action === 'sync' || action === 'login' || action === 'logout') {
      const progressToSave = docSnap.exists() && docSnap.data().progress ? docSnap.data().progress : {};
      const statusStr = action === 'login' ? 'Online' : (action === 'logout' ? 'Offline' : 'Active');
      const existingData = docSnap.exists() ? docSnap.data() : {};
      const newUserData = {
        email: userEmail,
        name: data.name || existingData.name || userName,
        avatar: data.avatar || existingData.avatar || userPicture,
        color: data.color || existingData.color || "",
        role: existingData.role ? existingData.role : (data.role || "Student"),
        progress: progressToSave,
        lastUpdated: new Date().toISOString(),
        status: statusStr
      };
      await setDoc(docRef, newUserData, { merge: true });
      return res.status(200).json({
        status: 'success',
        message: 'Synchronized',
        role: newUserData.role,
        progress: progressToSave,
        name: newUserData.name,
        avatar: newUserData.avatar,
        color: newUserData.color
      });
    }

    return res.status(400).json({ status: 'error' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
