# Multi-Authentication Implementation Plan
## For Claude Code Execution

---

## 🎯 OBJECTIVE
Add Email/Password, Microsoft, and Apple OAuth authentication while maintaining existing Google OAuth and Guest mode functionality.

**Priority Order:** Guest > Google > Microsoft > Apple > Email/Password

---

## 📋 TASK LIST FOR CLAUDE CODE

### Phase 1: Firebase Configuration (15 min)

**File: `src/config/firebase.js` (update or create)**

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Existing config...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');
export const appleProvider = new OAuthProvider('apple.com');

// Configure Microsoft
microsoftProvider.setCustomParameters({
  tenant: 'common', // For personal + org accounts
  prompt: 'select_account'
});

// Configure Apple
appleProvider.addScope('email');
appleProvider.addScope('name');
```

---

### Phase 2: Authentication Service (30 min)

**File: `src/services/authService.js` (CREATE NEW)**

```javascript
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
import { auth, googleProvider, microsoftProvider, appleProvider, db } from '../config/firebase';

// Sign in with OAuth (Google, Microsoft, Apple)
export const signInWithProvider = async (providerType) => {
  const providers = {
    google: googleProvider,
    microsoft: microsoftProvider,
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
      email,
      displayName,
      photoURL,
      createdAt,
      totalPoints: 0,
      badges: [],
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
```

---

### Phase 3: Auth Component UI (45 min)

**File: `src/components/Auth.jsx` (CREATE NEW)**

```javascript
import { useState } from 'react';
import { Mail, Lock, User, Shield, X } from 'lucide-react';
import { signInWithProvider, signInWithEmail, signUpWithEmail, resetPassword } from '../services/authService';

const Auth = ({ onClose, onSignIn }) => {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    setError('');
    const result = await signInWithProvider(provider);
    setLoading(false);
    
    if (result.success) {
      onSignIn(result.user);
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signInWithEmail(email, password);
    setLoading(false);
    
    if (result.success) {
      onSignIn(result.user);
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signUpWithEmail(email, password, displayName, parentEmail);
    setLoading(false);
    
    if (result.success) {
      setMessage('Account created! Please check your email to verify your account.');
      setMode('signin');
    } else {
      setError(result.error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await resetPassword(email);
    setLoading(false);
    
    if (result.success) {
      setMessage('Password reset email sent! Check your inbox.');
      setMode('signin');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl p-8 max-w-md w-full border-2 border-purple-500 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2 text-center">
          {mode === 'signup' ? 'Create Account' : mode === 'reset' ? 'Reset Password' : 'Welcome Back'}
        </h2>
        <p className="text-purple-200 text-center mb-6">
          {mode === 'signup' ? 'Join the adventure!' : 'Sign in to save your progress'}
        </p>

        {/* Messages */}
        {error && (
          <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-900 bg-opacity-50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuthSignIn('microsoft')}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
            </svg>
            Continue with Microsoft
          </button>

          <button
            onClick={() => handleOAuthSignIn('apple')}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 border border-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-500"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-br from-gray-900 to-purple-900 text-purple-300">
              or use email
            </span>
          </div>
        </div>

        {/* Email/Password Forms */}
        {mode === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Lock size={18} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <User size={18} />
                Your Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Mail size={18} />
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Shield size={18} />
                Parent's Email
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="parent@email.com"
              />
              <p className="text-purple-300 text-xs mt-1">We'll send a verification email</p>
            </div>
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Lock size={18} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Mode Switcher */}
        <div className="mt-6 text-center text-purple-300 text-sm space-y-2">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => setMode('signup')}
                className="hover:text-white transition-colors underline"
              >
                Don't have an account? Sign up
              </button>
              <br />
              <button
                onClick={() => setMode('reset')}
                className="hover:text-white transition-colors underline"
              >
                Forgot password?
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button
              onClick={() => setMode('signin')}
              className="hover:text-white transition-colors underline"
            >
              Already have an account? Sign in
            </button>
          )}
          {mode === 'reset' && (
            <button
              onClick={() => setMode('signin')}
              className="hover:text-white transition-colors underline"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
```

---

### Phase 4: Guest Data Migration Utility (20 min)

**File: `src/utils/migrateGuestData.js` (CREATE NEW)**

```javascript
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

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
```

---

### Phase 5: Update App.jsx (30 min)

**File: `src/App.jsx` (UPDATE)**

Add these features:
1. Import Auth component
2. Add auth state management
3. Show "Save Progress" prompt for guests with progress
4. Handle sign-in/sign-out
5. Sync data with Firebase when authenticated

**Key additions:**

```javascript
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { hasGuestProgress, migrateToFirebase } from './utils/migrateGuestData';
import Auth from './components/Auth';

// Add state for auth
const [user, setUser] = useState(null);
const [showAuth, setShowAuth] = useState(false);
const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);

// Listen to auth state changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    
    // Check if guest has progress and offer to save
    if (currentUser && hasGuestProgress()) {
      setShowMigrationPrompt(true);
    }
  });
  
  return unsubscribe;
}, []);

// Handle migration
const handleMigration = async () => {
  if (user) {
    const result = await migrateToFirebase(user.uid);
    if (result.success) {
      setShowMigrationPrompt(false);
      // Refresh data from Firebase
    }
  }
};
```

---

### Phase 6: Add "Sign In" Button to MainMenu (10 min)

**File: `src/components/MainMenu.jsx` (UPDATE)**

Add sign-in button in the header:

```javascript
// Add to header area
{!user && (
  <button
    onClick={() => setShowAuth(true)}
    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2"
  >
    <User size={20} />
    Sign In to Save
  </button>
)}

{user && (
  <div className="flex items-center gap-3">
    <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" />
    <span className="text-white font-semibold">{user.displayName}</span>
    <button
      onClick={handleSignOut}
      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
    >
      Sign Out
    </button>
  </div>
)}
```

---

### Phase 7: Migration Prompt Component (15 min)

**File: `src/components/MigrationPrompt.jsx` (CREATE NEW)**

```javascript
import { Trophy, Sparkles } from 'lucide-react';

const MigrationPrompt = ({ onMigrate, onDismiss, guestData }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-2xl p-8 max-w-md w-full border-2 border-green-500 shadow-2xl">
        <div className="text-center">
          <div className="bg-yellow-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={40} className="text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Save Your Progress! 🎉
          </h2>
          
          <p className="text-green-100 mb-6">
            You've been playing as a guest and earned:
          </p>
          
          <div className="bg-black bg-opacity-30 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-yellow-300">
              <Trophy size={24} />
              <span className="text-2xl font-bold">{guestData.totalPoints} points</span>
            </div>
            {guestData.badges.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-purple-300">
                <Sparkles size={20} />
                <span>{guestData.badges.length} badge{guestData.badges.length > 1 ? 's' : ''}</span>
              </div>
            )}
            {guestData.customLevels.length > 0 && (
              <div className="text-blue-300">
                {guestData.customLevels.length} custom level{guestData.customLevels.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          <p className="text-green-200 mb-6">
            Sign in now to save your progress to the cloud and access it from any device!
          </p>
          
          <button
            onClick={onMigrate}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl mb-3 transition-all transform hover:scale-105"
          >
            Yes! Save My Progress
          </button>
          
          <button
            onClick={onDismiss}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-all"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default MigrationPrompt;
```

---

## 🔧 FIREBASE CONSOLE SETUP

### Required Actions in Firebase Console:

1. **Enable Authentication Methods:**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable: Google (already done), Email/Password, Microsoft, Apple

2. **Apple OAuth Setup:**
   - Register app with Apple Developer
   - Get Service ID and Team ID
   - Add to Firebase Console

3. **Microsoft OAuth Setup:**
   - Register app in Azure AD
   - Get Application (client) ID
   - Add redirect URI from Firebase
   - Add to Firebase Console

4. **Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can only read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## ✅ TESTING CHECKLIST

After implementation, test:

- [ ] Google OAuth (existing - should still work)
- [ ] Microsoft OAuth
- [ ] Apple OAuth
- [ ] Email/Password signup
- [ ] Email verification flow
- [ ] Password reset
- [ ] Guest mode (no auth)
- [ ] Guest → Authenticated migration
- [ ] Data persistence in Firestore
- [ ] Sign out functionality
- [ ] UI on mobile devices

---

## 📦 PACKAGE DEPENDENCIES

Make sure these are in package.json:

```json
{
  "dependencies": {
    "firebase": "^10.7.1",
    "react": "^18.2.0",
    "lucide-react": "latest"
  }
}
```

---

## 🎨 UI/UX NOTES

1. **Non-intrusive guest mode** - Don't force sign-up
2. **Smart prompts** - Only show migration after 2-3 levels
3. **Visual consistency** - Match existing purple/pink gradient theme
4. **Mobile-first** - All modals responsive
5. **Clear benefits** - Explain why to sign up (save progress, sync devices)

---

## 🚀 DEPLOYMENT NOTES

Before deploying:
1. Update Firebase config with production credentials
2. Set up OAuth redirect URIs for production domain
3. Test all auth flows in production environment
4. Monitor Firebase Console for auth errors

---

## ⏱️ ESTIMATED TIMELINE

- Phase 1: 15 min
- Phase 2: 30 min
- Phase 3: 45 min
- Phase 4: 20 min
- Phase 5: 30 min
- Phase 6: 10 min
- Phase 7: 15 min

**Total: ~2.5 hours of focused implementation**

---

## 📝 NOTES FOR CLAUDE CODE

- Maintain existing code style and patterns
- Keep all existing functionality intact
- Add comprehensive error handling
- Include loading states for all async operations
- Follow existing component structure
- Use existing color scheme and design system
- Test each phase before moving to next

---

Ready for Claude Code to execute! 🚀
