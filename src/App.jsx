import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useGameState } from './hooks/useGameState';
import MainMenu from './components/MainMenu';
import GameEngine from './components/GameEngine';
import CreatorMode from './components/CreatorMode';
import LevelBrowser from './components/LevelBrowser';
import Leaderboard from './components/Leaderboard';
import UserProfile from './components/UserProfile';
import Auth from './components/Auth';
import MigrationPrompt from './components/MigrationPrompt';
import { auth } from './lib/firebase';
import { hasGuestProgress, migrateToFirebase, getGuestData } from './utils/migrateGuestData';
import { builtInTemplates } from './data/levelTemplates';
import { logOut } from './services/authService';

function App() {
  const [screen, setScreen] = useState('menu'); // 'menu', 'play', 'create', 'browse', 'leaderboard', 'profile'
  const [currentLevel, setCurrentLevel] = useState(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [playingCustom, setPlayingCustom] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const gameState = useGameState();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAuthUser(currentUser);

      // Check if guest has progress and offer to save
      if (currentUser && hasGuestProgress()) {
        setShowMigrationPrompt(true);
      }
    });

    return unsubscribe;
  }, []);

  const handlePlayBuiltIn = () => {
    const template = builtInTemplates[0];
    const level = template.generateLevel();
    setCurrentLevel({ ...level, template });
    setLevelIndex(0);
    setPlayingCustom(false);
    setScreen('play');
  };

  const handleNextLevel = () => {
    const nextIndex = (levelIndex + 1) % builtInTemplates.length;
    const template = builtInTemplates[nextIndex];
    const level = template.generateLevel();
    setCurrentLevel({ ...level, template });
    setLevelIndex(nextIndex);
  };

  const handleRetryLevel = () => {
    if (playingCustom) {
      // For custom levels, just reload the same level
      setCurrentLevel({ ...currentLevel });
    } else {
      // For built-in levels, regenerate with new numbers
      const template = builtInTemplates[levelIndex];
      const level = template.generateLevel();
      setCurrentLevel({ ...level, template });
    }
  };

  const handlePlayCustom = (customLevel, index) => {
    const template = builtInTemplates.find(t => t.type === customLevel.scenarioType) || builtInTemplates[0];
    setCurrentLevel({ ...customLevel, template: { ...template, title: customLevel.title } });
    setLevelIndex(index);
    setPlayingCustom(true);
    setScreen('play');
  };

  const handleBackFromGame = () => {
    if (playingCustom) {
      setScreen('browse');
    } else {
      setScreen('menu');
    }
  };

  const handleViewProfile = (user) => {
    setProfileUser(user);
    setScreen('profile');
  };

  const handleBackToLeaderboard = () => {
    setProfileUser(null);
    setScreen('leaderboard');
  };

  const handleLevelComplete = (levelIdx, solveTime) => {
    // Record fastest time for this level
    if (solveTime > 0) {
      gameState.recordFastestTime(`level_${levelIdx + 1}`, solveTime);
    }
    // Increment levels completed
    gameState.completedLevel();
  };

  const handleSignIn = (user) => {
    setAuthUser(user);
  };

  const handleSignOut = async () => {
    await logOut();
    setAuthUser(null);
  };

  const handleMigration = async () => {
    if (authUser) {
      const result = await migrateToFirebase(authUser.uid);
      if (result.success) {
        setShowMigrationPrompt(false);
        // Reload the page to refresh data from Firebase
        window.location.reload();
      } else {
        alert('Failed to migrate data. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen">
      {screen === 'menu' && (
        <MainMenu
          totalPoints={gameState.totalPoints}
          badges={gameState.badges}
          customLevelCount={gameState.customLevels.length}
          user={authUser}
          onPlayGame={handlePlayBuiltIn}
          onCreateLevel={() => setScreen('create')}
          onBrowseLevels={() => setScreen('browse')}
          onViewLeaderboard={() => setScreen('leaderboard')}
          onShowAuth={() => setShowAuth(true)}
          onSignOut={handleSignOut}
        />
      )}

      {screen === 'play' && currentLevel && (
        <GameEngine
          level={currentLevel}
          levelIndex={levelIndex}
          playingCustom={playingCustom}
          totalPoints={gameState.totalPoints}
          badges={gameState.badges}
          onAddPoints={gameState.addPoints}
          onAddBadge={gameState.addBadge}
          onLevelComplete={handleLevelComplete}
          onNextLevel={handleNextLevel}
          onRetry={handleRetryLevel}
          onBack={handleBackFromGame}
          builtInTemplates={builtInTemplates}
        />
      )}

      {screen === 'create' && (
        <CreatorMode
          onSave={(level) => {
            gameState.saveCustomLevel(level);
            setScreen('browse');
          }}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'browse' && (
        <LevelBrowser
          customLevels={gameState.customLevels}
          onPlayLevel={handlePlayCustom}
          onDeleteLevel={gameState.deleteCustomLevel}
          onCreateNew={() => setScreen('create')}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'leaderboard' && (
        <Leaderboard
          user={gameState.user}
          onBack={() => setScreen('menu')}
          onViewProfile={handleViewProfile}
        />
      )}

      {screen === 'profile' && (
        <UserProfile
          user={gameState.user}
          profileUser={profileUser}
          onBack={profileUser ? handleBackToLeaderboard : () => setScreen('menu')}
        />
      )}

      {/* Auth Modal */}
      {showAuth && (
        <Auth
          onClose={() => setShowAuth(false)}
          onSignIn={handleSignIn}
        />
      )}

      {/* Migration Prompt */}
      {showMigrationPrompt && authUser && (
        <MigrationPrompt
          onMigrate={handleMigration}
          onDismiss={() => setShowMigrationPrompt(false)}
          guestData={getGuestData()}
        />
      )}
    </div>
  );
}

export default App;
