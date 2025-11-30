import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, limit, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Mathwizards Configuration
// Domain: mathwizards.io
// TODO: Update authDomain after deploying to mathwizards.io

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate configuration
if (!firebaseConfig.apiKey) {
  throw new Error(
    'Missing Firebase configuration! ' +
    'Please copy .env.example to .env and add your Firebase credentials.'
  );
}


//Intitialize firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Configure Apple
appleProvider.addScope('email');
appleProvider.addScope('name');

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Firestore functions for custom levels
export const saveLevel = async (userId, level) => {
  try {
    const docRef = await addDoc(collection(db, 'levels'), {
      ...level,
      userId,
      createdAt: new Date().toISOString(),
      likes: 0,
      plays: 0
    });

    // Increment the user's levelsCreated count
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const currentData = userDoc.data();
      await updateDoc(userRef, {
        levelsCreated: (currentData.levelsCreated || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }

    return { id: docRef.id, ...level };
  } catch (error) {
    console.error("Error saving level:", error);
    throw error;
  }
};

export const getUserLevels = async (userId) => {
  try {
    const q = query(
      collection(db, 'levels'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user levels:", error);
    throw error;
  }
};

export const getAllLevels = async () => {
  try {
    const q = query(
      collection(db, 'levels'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all levels:", error);
    throw error;
  }
};

export const deleteLevel = async (levelId) => {
  try {
    await deleteDoc(doc(db, 'levels', levelId));
  } catch (error) {
    console.error("Error deleting level:", error);
    throw error;
  }
};

// User Stats Functions
export const initializeUserStats = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        email: user.email || '',
        totalPoints: 0,
        weeklyPoints: 0,
        lastWeekReset: serverTimestamp(),
        badges: [],
        levelsCompleted: 0,
        levelsCreated: 0,
        fastestTimes: {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      // Check if we need to reset weekly points (every Monday)
      const userData = userDoc.data();
      const lastReset = userData.lastWeekReset?.toDate();
      const now = new Date();

      if (lastReset) {
        const daysSinceReset = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));
        const currentDay = now.getDay();
        const lastResetDay = lastReset.getDay();

        // Reset if it's been more than 7 days or if we've passed a Monday
        if (daysSinceReset >= 7 || (currentDay === 1 && lastResetDay !== 1)) {
          await updateDoc(userRef, {
            weeklyPoints: 0,
            lastWeekReset: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }
    }

    return userRef;
  } catch (error) {
    console.error("Error initializing user stats:", error);
    throw error;
  }
};

export const getUserStats = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw error;
  }
};

export const updateUserStats = async (userId, stats) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...stats,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
};

export const addPointsToUser = async (userId, points) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data();
      await updateDoc(userRef, {
        totalPoints: (currentData.totalPoints || 0) + points,
        weeklyPoints: (currentData.weeklyPoints || 0) + points,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
};

export const addBadgeToUser = async (userId, badgeId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data();
      const badges = currentData.badges || [];

      if (!badges.includes(badgeId)) {
        await updateDoc(userRef, {
          badges: [...badges, badgeId],
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error("Error adding badge:", error);
    throw error;
  }
};

export const updateFastestTime = async (userId, levelId, timeInSeconds) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data();
      const fastestTimes = currentData.fastestTimes || {};

      // Only update if this is a new record
      if (!fastestTimes[levelId] || timeInSeconds < fastestTimes[levelId]) {
        await updateDoc(userRef, {
          [`fastestTimes.${levelId}`]: timeInSeconds,
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error("Error updating fastest time:", error);
    throw error;
  }
};

export const incrementLevelsCompleted = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data();
      await updateDoc(userRef, {
        levelsCompleted: (currentData.levelsCompleted || 0) + 1,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error incrementing levels completed:", error);
    throw error;
  }
};

// Leaderboard Functions
export const getLeaderboard = async () => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('totalPoints', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    throw error;
  }
};

export const getWeeklyLeaderboard = async () => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('weeklyPoints', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting weekly leaderboard:", error);
    throw error;
  }
};

export const getSpeedRunBoard = async (levelId = 'level_1') => {
  try {
    // Get all users who have completed this level
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const speedRunners = [];

    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.fastestTimes && userData.fastestTimes[levelId]) {
        speedRunners.push({
          id: doc.id,
          ...userData,
          fastestTime: userData.fastestTimes[levelId],
          levelName: `Level ${levelId.replace('level_', '')}`
        });
      }
    });

    // Sort by fastest time and return top 50
    return speedRunners
      .sort((a, b) => a.fastestTime - b.fastestTime)
      .slice(0, 50);
  } catch (error) {
    console.error("Error getting speed run board:", error);
    throw error;
  }
};

export const getUserRank = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    const userPoints = userData.totalPoints || 0;

    // Count how many users have more points
    const q = query(
      collection(db, 'users'),
      where('totalPoints', '>', userPoints)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.size + 1; // +1 because rank is 1-indexed
  } catch (error) {
    console.error("Error getting user rank:", error);
    throw error;
  }
};