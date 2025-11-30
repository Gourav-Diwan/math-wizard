import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Get guest data from localStorage
export const getGuestData = () => {
  const localData = {
    totalPoints: parseInt(localStorage.getItem('totalPoints')) || 0,
    badges: JSON.parse(localStorage.getItem('badges') || '[]'),
    customLevels: JSON.parse(localStorage.getItem('customLevels') || '[]'),
    completedLevels: JSON.parse(localStorage.getItem('completedLevels') || '[]')
  };

  return localData;
};

// Check if user has guest progress
export const hasGuestProgress = () => {
  const data = getGuestData();
  return data.totalPoints > 0 || data.badges.length > 0 || data.customLevels.length > 0;
};

// Migrate guest data to Firebase
export const migrateToFirebase = async (userId) => {
  try {
    const guestData = getGuestData();
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      totalPoints: guestData.totalPoints,
      badges: guestData.badges,
      customLevels: guestData.customLevels,
      completedLevels: guestData.completedLevels,
      migratedAt: new Date().toISOString()
    });

    // Clear local storage after successful migration
    localStorage.removeItem('totalPoints');
    localStorage.removeItem('badges');
    localStorage.removeItem('customLevels');
    localStorage.removeItem('completedLevels');

    return { success: true };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error: error.message };
  }
};
