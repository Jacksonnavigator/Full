// ⚙️  FIREBASE CREDENTIALS SETUP
// 
// Follow these steps to add your real Firebase credentials:
//
// 1. Go to Firebase Console: https://console.firebase.google.com
// 2. Select project: hydranet-e071d
// 3. Click Settings (gear icon) → Project Settings
// 4. Scroll down to "Your apps" section
// 5. Click the Web app icon (</> symbol)
// 6. Copy the firebaseConfig object
// 7. Replace the values below with YOUR credentials
//
// ⚠️  NEVER commit credentials to git! Add to .gitignore first

const firebaseConfig = {
  // 👇 REPLACE THESE WITH YOUR VALUES FROM FIREBASE CONSOLE
  apiKey: "COPY_FROM_FIREBASE_CONSOLE",
  authDomain: "hydranet-e071d.firebaseapp.com", // Can leave as is
  projectId: "hydranet-e071d", // ✅ Already correct
  storageBucket: "hydranet-e071d.appspot.com", // Can leave as is
  messagingSenderId: "COPY_FROM_FIREBASE_CONSOLE",
  appId: "COPY_FROM_FIREBASE_CONSOLE",
};

// HOW TO FIND EACH VALUE:
// 
// apiKey:           Look for "apiKey:" in Firebase Console firebaseConfig
// authDomain:       Usually: projectId.firebaseapp.com (auto-filled ✅)
// projectId:        hydranet-e071d (already set ✅)
// storageBucket:    Usually: projectId.appspot.com (auto-filled ✅)
// messagingSenderId: Look for "messagingSenderId:" in Firebase Console
// appId:            Look for "appId:" in Firebase Console

// EXAMPLE of what you'll see in Firebase Console:
// {
//   apiKey: "AIzaSyAa1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1",
//   authDomain: "hydranet-e071d.firebaseapp.com",
//   projectId: "hydranet-e071d",
//   storageBucket: "hydranet-e071d.appspot.com",
//   messagingSenderId: "123456789012",
//   appId: "1:123456789012:web:aaa1a1a1a1a1a1a1a1a1a1"
// }

export default firebaseConfig;
