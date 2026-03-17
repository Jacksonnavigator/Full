/**
 * Setup Test Users with Custom Claims
 * Run this once: node scripts/setupTestUsers.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'hydranet-e071d',
  });
} catch (error) {
  console.error('❌ Error: serviceAccountKey.json not found!');
  console.error('   Download it from: Firebase Console > Project Settings > Service Accounts > Generate new private key');
  process.exit(1);
}

const auth = admin.auth();
const db = admin.firestore();

const testUsers = [
  {
    email: 'engineer@test.com',
    password: 'Test123456',
    displayName: 'Test Engineer',
    customClaims: {
      role: 'Engineer',
      teamId: 'team-1',
      utilityId: 'util-1',
    },
  },
  {
    email: 'manager@test.com',
    password: 'Test123456',
    displayName: 'Test Team Leader',
    customClaims: {
      role: 'Team Leader',
      teamId: 'team-1',
      utilityId: 'util-1',
    },
  },
  {
    email: 'dma@test.com',
    password: 'Test123456',
    displayName: 'Test DMA Manager',
    customClaims: {
      role: 'DMA',
      dmaId: 'dma-1',
      teamId: 'team-1',
      utilityId: 'util-1',
    },
  },
];

async function setupTestUsers() {
  console.log('🚀 Starting test user setup...\n');

  for (const user of testUsers) {
    try {
      // Check if user exists
      let firebaseUser;
      try {
        firebaseUser = await auth.getUserByEmail(user.email);
        console.log(`✓ User ${user.email} already exists (UID: ${firebaseUser.uid})`);
      } catch (error) {
        // User doesn't exist, create it
        firebaseUser = await auth.createUser({
          email: user.email,
          password: user.password,
          displayName: user.displayName,
          emailVerified: true,
        });
        console.log(`✓ Created user: ${user.email} (UID: ${firebaseUser.uid})`);
      }

      // Set custom claims
      await auth.setCustomUserClaims(firebaseUser.uid, user.customClaims);
      console.log(`✓ Set custom claims for ${user.email}:`);
      console.log(`  Role: ${user.customClaims.role}`);
      console.log(`  Team ID: ${user.customClaims.teamId}\n`);

      // Also create user document in Firestore
      const nameParts = user.displayName.split(' ');
      await db.collection('users').doc(firebaseUser.uid).set(
        {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: user.email,
          firstName: nameParts[0] || user.displayName,
          lastName: nameParts[1] || '',
          role: user.customClaims.role,
          teamId: user.customClaims.teamId,
          utilityId: user.customClaims.utilityId,
          dmaId: user.customClaims.dmaId || null,
          isApproved: true,  // Mark as approved for testing
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log(`✓ Created/updated Firestore user document\n`);
    } catch (error) {
      console.error(`❌ Error setting up ${user.email}:`, error.message);
    }
  }

  console.log('✅ Test user setup complete!');
  console.log('\n📝 Test credentials:');
  testUsers.forEach(user => {
    console.log(`   ${user.email} / Test123456 (${user.customClaims.role})`);
  });

  process.exit(0);
}

setupTestUsers().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
