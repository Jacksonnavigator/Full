import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * IMPORTANT: Replace these with your Firebase project credentials
 * Get these from Firebase Console > Project Settings > Your apps
 */
const firebaseConfig = {
  apiKey: 'AIzaSyAskV8AX4eZX2OXZKXHS4addn8cv-Bm9pY',
  authDomain: 'hydranet-e071d.firebaseapp.com',
  projectId: 'hydranet-e071d',
  storageBucket: 'hydranet-e071d.appspot.com',
  messagingSenderId: '781622805026',
  appId: '1:781622805026:web:d86cefd09a285c3130407b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with AsyncStorage persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;