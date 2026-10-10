import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { OAuth2Client } from 'google-auth-library';
import { CLIENT_ID, SUPER_ADMINS, COURSES } from '@/lib/constants';

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

function getDb() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ status: 'error', message: 'Missing Authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let payload: any;
    try {
      const ticket = await client.verifyIdToken({ idToken: token, audience: CLIENT_ID });
      payload = ticket.getPayload();
    } catch {
      return NextResponse.json({ status: 'error', message: 'Invalid or expired Google token' }, { status: 401 });
    }

    if (!payload || !payload.email) {
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = String(payload.email).toLowerCase().trim();
    const isSuperAdmin = SUPER_ADMINS.includes(userEmail);
    const userName = payload.name || 'Cadet';
    const userPicture = payload.picture || '';

    const db = getDb();
    const blockedRef = doc(db, 'blocked_emails', userEmail);
    const blockedSnap = await getDoc(blockedRef);
    if (blockedSnap.exists()) {
      return NextResponse.json({ status: 'error', message: 'Account has been blocked' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'load';
    const docRef = doc(db, 'users', userEmail);
    const docSnap = await getDoc(docRef);

    // 1. ACTION: LOAD
    if (action === 'load') {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const role = isSuperAdmin ? 'Admin' : (userData.role || null);
        return NextResponse.json({
          status: 'success',
          name: userData.name || userName,
          avatar: userData.avatar || userPicture,
          color: userData.color || '',
          role,
          progress: userData.progress,
        });
      }
      return NextResponse.json({
        status: 'new_user',
        message: 'No progress found',
        role: isSuperAdmin ? 'Admin' : null,
      });
    }

    // 2. ACTION: GET USERS (Admin Only)
    if (action === 'getUsers') {
      const userRole = isSuperAdmin ? 'Admin' : (docSnap.exists() ? docSnap.data().role : null);
      if (userRole !== 'Admin') {
        return NextResponse.json({ status: 'error', message: 'Unauthorized: Admins only' }, { status: 403 });
      }

      const querySnapshot = await getDocs(collection(db, 'users'));
      const users: any[] = [];
      querySnapshot.forEach((d) => {
        users.push(d.data());
      });

      return NextResponse.json({ status: 'success', users });
    }

    // 3. ACTION: REMOVE USER (Admin Only)
    if (action === 'removeUser') {
      const userRole = isSuperAdmin ? 'Admin' : (docSnap.exists() ? docSnap.data().role : null);
      if (userRole !== 'Admin') {
        return NextResponse.json({ status: 'error', message: 'Unauthorized: Admins only' }, { status: 403 });
      }

      if (!body.targetEmail) {
        return NextResponse.json({ status: 'error', message: 'Target email is required' }, { status: 400 });
      }

      const target = String(body.targetEmail).toLowerCase().trim();
      await setDoc(doc(db, 'blocked_emails', target), {
        blockedAt: new Date().toISOString(),
        blockedBy: userEmail,
      });
      await deleteDoc(doc(db, 'users', target));
      return NextResponse.json({ status: 'success', message: 'User blocked and removed' });
    }

    // 4. ACTION: ADVANCE LEVEL
    if (action === 'advanceLevel') {
      const { courseKey, newLevel } = body;
      const course = COURSES.find((c) => c.key === courseKey);
      if (!course) return NextResponse.json({ status: 'error', message: 'Invalid course' }, { status: 400 });

      let progress = docSnap.exists() && docSnap.data().progress ? docSnap.data().progress : {};
      if (!progress.levels) progress.levels = {};
      if (!progress.missions) progress.missions = {};
      if (!progress.xp) progress.xp = 0;
      if (!progress.badges) progress.badges = [];

      const currentLevel = progress.levels[courseKey] || 1;
      if (newLevel > currentLevel && newLevel <= course.totalLevels + 1) {
        progress.xp += (newLevel - currentLevel) * course.levelReward;
        progress.levels[courseKey] = newLevel;
        await setDoc(docRef, { progress, lastUpdated: new Date().toISOString() }, { merge: true });
      }

      return NextResponse.json({ status: 'success', progress });
    }

    // 5. ACTION: COMPLETE COURSE
    if (action === 'completeCourse') {
      const { courseKey } = body;
      const course = COURSES.find((c) => c.key === courseKey);
      if (!course) return NextResponse.json({ status: 'error', message: 'Invalid course' }, { status: 400 });

      let progress = docSnap.exists() && docSnap.data().progress ? docSnap.data().progress : {};
      if (!progress.missions) progress.missions = {};
      if (!progress.xp) progress.xp = 0;
      if (!progress.badges) progress.badges = [];
      if (!progress.levels) progress.levels = {};

      if (!progress.missions[courseKey]) {
        progress.missions[courseKey] = true;
        progress.xp += course.courseReward;
        const badgeName = `${course.shortName} Wings`;
        if (!progress.badges.includes(badgeName)) progress.badges.push(badgeName);
        await setDoc(docRef, { progress, lastUpdated: new Date().toISOString() }, { merge: true });
      }

      return NextResponse.json({ status: 'success', progress });
    }

    // 6. ACTION: SYNC / LOGIN / LOGOUT
    if (action === 'sync' || action === 'login' || action === 'logout') {
      const existingData = docSnap.exists() ? docSnap.data() : {};
      let progressToSave = existingData.progress || {};

      if (body.progress) {
        progressToSave = body.progress;
      }

      const statusStr = action === 'login' ? 'Online' : action === 'logout' ? 'Offline' : 'Active';
      let finalRole = isSuperAdmin ? 'Admin' : (existingData.role || body.role || '');

      // Preserve existing custom animal avatar or custom name if login action doesn't explicitly override
      const finalName = action === 'login' && existingData.name ? existingData.name : (body.name || existingData.name || userName);
      const finalAvatar = action === 'login' && existingData.avatar ? existingData.avatar : (body.avatar || existingData.avatar || userPicture);
      const finalColor = body.color || existingData.color || '';

      const newUserData = {
        email: userEmail,
        name: finalName,
        avatar: finalAvatar,
        color: finalColor,
        role: finalRole,
        progress: progressToSave,
        lastUpdated: new Date().toISOString(),
        status: statusStr,
      };

      await setDoc(docRef, newUserData, { merge: true });
      return NextResponse.json({
        status: 'success',
        message: 'Synchronized',
        role: finalRole,
        progress: progressToSave,
        name: newUserData.name,
        avatar: newUserData.avatar,
        color: newUserData.color,
      });
    }

    return NextResponse.json({ status: 'error', message: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ status: 'error', message: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
