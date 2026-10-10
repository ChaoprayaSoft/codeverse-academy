const fs = require('fs');
let code = fs.readFileSync('api/codeverse.js', 'utf8');

code = code.replace(/const \{ initializeApp \} = require\("firebase\/app"\);\r?\nconst \{ getFirestore.* \} = require\("firebase\/firestore"\);/, 'const admin = require("firebase-admin");');
code = code.replace(/const firebaseConfig = \{[\s\S]*?\};\r?\n\r?\nlet app;\r?\nlet db;\r?\n\r?\nfunction initFirebase\(\) \{[\s\S]*?return db;\r?\n\}/, 'if (!admin.apps.length) {\n  admin.initializeApp({ projectId: "codeverse-1a8ec" });\n}\nconst db = admin.firestore();');
code = code.replace(/const db = initFirebase\(\);\r?\n\s*/, '');

code = code.replace(/\.exists\(\)/g, '.exists');

code = code.replace(/const blockedRef = doc\(db, "blocked_emails", userEmail\);\r?\n\s*const blockedSnap = await getDoc\(blockedRef\);/, 'const blockedRef = db.collection("blocked_emails").doc(userEmail);\n    const blockedSnap = await blockedRef.get();');
code = code.replace(/const docRef = doc\(db, "users", userEmail\);\r?\n\s*const docSnap = await getDoc\(docRef\);/, 'const docRef = db.collection("users").doc(userEmail);\n    const docSnap = await docRef.get();');

code = code.replace(/const querySnapshot = await getDocs\(collection\(db, "users"\)\);/, 'const querySnapshot = await db.collection("users").get();');

code = code.replace(/await setDoc\(doc\(db, "blocked_emails", data\.targetEmail\), \{/g, 'await db.collection("blocked_emails").doc(data.targetEmail).set({');
code = code.replace(/await setDoc\(docRef, /g, 'await docRef.set(');

code = code.replace(/await deleteDoc\(doc\(db, "users", data\.targetEmail\)\);/g, 'await db.collection("users").doc(data.targetEmail).delete();');

fs.writeFileSync('api/codeverse.js', code);
console.log("Done");
