// migrate_codeverse_to_firebase.js
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCNMpcfZJUSQpHGIvqVc0QE2lCjP-i2fg0",
  authDomain: "codeverse-1a8ec.firebaseapp.com",
  projectId: "codeverse-1a8ec",
  storageBucket: "codeverse-1a8ec.firebasestorage.app",
  messagingSenderId: "722458959167",
  appId: "1:722458959167:web:04381efd7a05b99eaac78a",
  measurementId: "G-74N5JK9DZQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbwlFbkGFdmLHA0olAwITzqUhCvD2bmfVkQRIN5XHAlAU8cyoQFmtgyQnBsbKKLExFEoJg/exec";

async function migrateData() {
  console.log("1. Fetching all users from Google Sheets...");
  try {
    const response = await fetch(SHEETS_API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "getUsers", email: "tiawongsombat@gmail.com" })
    });
    
    const result = await response.json();
    if (result.status !== "success") {
      throw new Error("Failed to fetch users: " + result.message);
    }
    
    const users = result.users || [];
    console.log(`✅ Fetched ${users.length} users from Google Sheets.`);
    
    console.log("\n2. Pushing users to Firestore...");
    let successCount = 0;
    
    for (const user of users) {
      if (!user.email) continue;
      
      const email = String(user.email).toLowerCase().trim();
      try {
        await setDoc(doc(db, "users", email), {
          email: email,
          name: user.name || "",
          avatar: user.avatar || "",
          color: user.color || "",
          role: user.role || "Student",
          progress: user.progress || {},
          lastUpdated: user.lastUpdated || new Date().toISOString(),
          status: user.status || "Offline"
        });
        successCount++;
        process.stdout.write("."); // simple progress indicator
      } catch (err) {
        console.error(`\n❌ Error pushing ${email}:`, err.message);
      }
    }
    
    console.log(`\n\n✅ Migration Complete! Successfully migrated ${successCount} out of ${users.length} users to Firestore.`);
    console.log("\nIMPORTANT: Please ensure your Firestore Security Rules allow writes for this migration.");
    
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

migrateData();
