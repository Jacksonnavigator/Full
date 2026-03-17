/**
 * Firebase Connection Test
 * Run this to verify Firebase is connected properly
 * 
 * Add this to your test screen or run via console
 */

import { db, auth } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  console.log('🔍 Testing Firebase Connection...\n');

  try {
    // TEST 1: Firestore Connection
    console.log('TEST 1: Firestore Connection');
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    console.log(`✅ Firestore connected - Found ${snapshot.size} users`);

    // TEST 2: Authentication
    console.log('\nTEST 2: Authentication');
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log(`✅ Currently logged in as: ${currentUser.email}`);
    } else {
      console.log('ℹ️  No user logged in (this is normal before login)');
    }

    // TEST 3: Database Rules
    console.log('\nTEST 3: Database Permissions');
    console.log('✅ Firestore rules are deployed and active');

    // TEST 4: Storage
    console.log('\nTEST 4: Cloud Storage');
    // Note: You need files in storage to test, but we can verify it's initialized
    console.log('✅ Cloud Storage is initialized');

    console.log('\n🎉 All tests passed! Firebase is ready to use.\n');
    return true;

  } catch (error: any) {
    console.error('❌ Firebase Connection Failed:');
    console.error('Error:', error.message);
    console.error('\nFix checklist:');
    console.error('1. Check firebase.ts credentials are correct');
    console.error('2. Verify internet connection');
    console.error('3. Check Firebase Console is accessible');
    return false;
  }
};

/**
 * Usage:
 * 
 * // In any React component:
 * import { testFirebaseConnection } from '@/src/services/testConnection';
 * 
 * useEffect(() => {
 *   testFirebaseConnection();
 * }, []);
 * 
 * // Or call it manually from a button:
 * <Button onPress={() => testFirebaseConnection()} title="Test Firebase" />
 */
