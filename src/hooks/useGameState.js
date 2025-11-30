import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  saveLevel as saveLevelToFirebase,
  getUserLevels,
  deleteLevel as deleteLevelFromFirebase,
  initializeUserStats,
  getUserStats,
  addPointsToUser,
  addBadgeToUser,
  updateFastestTime,
  incrementLevelsCompleted
} from '../lib/firebase';

export const useGameState = () => {
  const { user } = useAuth();
  const [totalPoints, setTotalPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [customLevels, setCustomLevels] = useState([]);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [fastestTimes, setFastestTimes] = useState({});
  const [levelsCompleted, setLevelsCompleted] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load user's data when they sign in
  useEffect(() => {
    if (user) {
      initializeUser();
      loadUserLevels();
      loadUserStats();
    } else {
      // Clear data when signed out
      setCustomLevels([]);
      setTotalPoints(0);
      setBadges([]);
      setWeeklyPoints(0);
      setFastestTimes({});
      setLevelsCompleted(0);
    }
  }, [user]);

  const initializeUser = async () => {
    if (!user) return;

    try {
      await initializeUserStats(user);
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const stats = await getUserStats(user.uid);
      if (stats) {
        setTotalPoints(stats.totalPoints || 0);
        setBadges(stats.badges || []);
        setWeeklyPoints(stats.weeklyPoints || 0);
        setFastestTimes(stats.fastestTimes || {});
        setLevelsCompleted(stats.levelsCompleted || 0);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadUserLevels = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const levels = await getUserLevels(user.uid);
      setCustomLevels(levels);
    } catch (error) {
      console.error('Error loading levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (points) => {
    if (!user) {
      // If not signed in, just update local state
      setTotalPoints(prev => prev + points);
      return;
    }

    try {
      await addPointsToUser(user.uid, points);
      setTotalPoints(prev => prev + points);
      setWeeklyPoints(prev => prev + points);
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const addBadge = async (badgeId) => {
    if (badges.includes(badgeId)) return;

    setBadges(prev => [...prev, badgeId]);

    if (user) {
      try {
        await addBadgeToUser(user.uid, badgeId);
      } catch (error) {
        console.error('Error adding badge:', error);
      }
    }
  };

  const recordFastestTime = async (levelId, timeInSeconds) => {
    if (!user) return;

    try {
      await updateFastestTime(user.uid, levelId, timeInSeconds);
      setFastestTimes(prev => ({
        ...prev,
        [levelId]: timeInSeconds
      }));
    } catch (error) {
      console.error('Error recording fastest time:', error);
    }
  };

  const completedLevel = async () => {
    if (!user) return;

    try {
      await incrementLevelsCompleted(user.uid);
      setLevelsCompleted(prev => prev + 1);
    } catch (error) {
      console.error('Error incrementing levels completed:', error);
    }
  };

  const saveCustomLevel = async (level) => {
    if (!user) {
      alert('Please sign in to save custom levels!');
      return null;
    }

    try {
      const savedLevel = await saveLevelToFirebase(user.uid, level);
      setCustomLevels(prev => [savedLevel, ...prev]);
      return savedLevel;
    } catch (error) {
      console.error('Error saving level:', error);
      alert('Failed to save level. Please try again.');
      return null;
    }
  };

  const deleteCustomLevel = async (id) => {
    if (!user) return;

    try {
      await deleteLevelFromFirebase(id);
      setCustomLevels(prev => prev.filter(level => level.id !== id));
    } catch (error) {
      console.error('Error deleting level:', error);
      alert('Failed to delete level. Please try again.');
    }
  };

  return {
    totalPoints,
    badges,
    customLevels,
    weeklyPoints,
    fastestTimes,
    levelsCompleted,
    loading,
    addPoints,
    addBadge,
    recordFastestTime,
    completedLevel,
    saveCustomLevel,
    deleteCustomLevel,
    user
  };
};