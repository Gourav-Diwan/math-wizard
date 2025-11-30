import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, appleProvider, db } from '../lib/firebase';

// Sign in with OAuth (Google, Apple)
export const signInWithProvider = async (providerType) => {
  const providers = {
    google: googleProvider,
    apple: appleProvider
  };

  try {
    const provider = providers[providerType];
    const result = await signInWithPopup(auth, provider);
    await createUserDocument(result.user);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Email/Password Sign Up (with parent verification)
export const signUpWithEmail = async (email, password, displayName, parentEmail) => {
  try {
    // Create account
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile
    await updateProfile(result.user, { displayName });

    // Send verification email
    await sendEmailVerification(result.user);

    // Create user document with parent email
    await createUserDocument(result.user, { parentEmail, needsParentVerification: true });

    return { success: true, user: result.user, needsVerification: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Password Reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign Out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Create/Update User Document in Firestore
const createUserDocument = async (user, additionalData = {}) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date().toISOString();

    await setDoc(userRef, {
      uid: user.uid,
      email,
      displayName,
      photoURL: photoURL || '',
      createdAt,
      totalPoints: 0,
      weeklyPoints: 0,
      badges: [],
      levelsCompleted: 0,
      levelsCreated: 0,
      fastestTimes: {},
      customLevels: [],
      ...additionalData
    });
  }
};

// Get User Data
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
