const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs } = require("firebase/firestore");
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = "1049203742621-85p09ruvq6kr2m1bnu1kg933ajhbjen3.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

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

  const db = initFirebase();
  const action = data.action;

  try {
    // Check if user is permanently blocked
    const blockedRef = doc(db, "blocked_emails", userEmail);
    const blockedSnap = await getDoc(blockedRef);
    if (blockedSnap.exists()) {
       return res.status(403).json({ status: 'error', message: 'This email has been permanently blocked from accessing CodeVerse.' });
    }

    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);

    if (action === 'load') {
      if (docSnap.exists()) {
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
      if (!docSnap.exists() || docSnap.data().role !== 'Admin') {
         return res.status(403).json({ status: 'error', message: 'Unauthorized: Admins only' });
      }
      
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = [];
      querySnapshot.forEach((d) => {
          users.push(d.data());
      });
      return res.status(200).json({ status: 'success', message: 'Users fetched', users });
    }

    if (action === 'removeUser') {
      if (!docSnap.exists() || docSnap.data().role !== 'Admin') {
         return res.status(403).json({ status: 'error', message: 'Unauthorized: Admins only' });
      }
      if (!data.targetEmail) {
         return res.status(400).json({ status: 'error', message: 'Missing targetEmail' });
      }
      
      // 1. Add to blocked_emails collection
      await setDoc(doc(db, "blocked_emails", data.targetEmail), {
          blockedAt: new Date().toISOString(),
          blockedBy: userEmail
      });
      
      // 2. Delete the user document entirely
      await deleteDoc(doc(db, "users", data.targetEmail));
      
      return res.status(200).json({ status: 'success', message: 'User permanently removed and blocked' });
    }

    if (action === 'sync' || action === 'login' || action === 'logout') {
      const progressToSave = data.progress || (docSnap.exists() ? docSnap.data().progress : {});
      const statusStr = action === 'login' ? 'Online' : (action === 'logout' ? 'Offline' : 'Active');
      
      // Merge with existing data so we don't accidentally downgrade their role if the client tried to set it to 'Student'
      const existingData = docSnap.exists() ? docSnap.data() : {};
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

      await setDoc(docRef, newUserData, { merge: true });
      return res.status(200).json({ status: 'success', message: 'Synchronized' });
    }

    return res.status(400).json({ status: 'error', message: 'Unknown action' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
