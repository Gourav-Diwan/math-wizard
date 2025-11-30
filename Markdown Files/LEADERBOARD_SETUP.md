# Leaderboard System Setup Guide

## Overview
The leaderboard system has been successfully implemented with the following features:

### Features Implemented
1. **Leaderboard Component** - Three tabs:
   - All Time: Top 50 players by total points
   - This Week: Top 50 players by weekly points (resets every Monday)
   - Speed Runs: Fastest completion times per level

2. **User Profile Component**:
   - Display total points and weekly points
   - Show badges earned
   - Display levels completed and created
   - Show fastest times for each level
   - Display global rank

3. **Stats Tracking**:
   - Total points (persistent)
   - Weekly points (resets every Monday)
   - Fastest times per level
   - Levels completed count
   - Levels created count
   - Badges earned

4. **Main Menu Integration**:
   - New "Leaderboard" button (orange/yellow gradient)
   - Trophy icon matching the design theme

## Firebase Setup Required

### 1. Deploy Firestore Indexes
The leaderboard queries require composite indexes. Deploy them using:

```bash
firebase deploy --only firestore:indexes
```

This will use the `firestore.indexes.json` file that has been created.

### 2. Deploy Security Rules
Update your Firestore security rules to protect user data:

```bash
firebase deploy --only firestore:rules
```

This will use the `firestore.rules` file that has been created.

### 3. Manual Index Creation (Alternative)
If you prefer, you can manually create indexes in the Firebase Console:

1. Go to Firebase Console > Firestore Database > Indexes
2. Create these composite indexes:
   - Collection: `users`, Field: `totalPoints` (Descending)
   - Collection: `users`, Field: `weeklyPoints` (Descending)

## Firestore Data Structure

### Users Collection (`users/{userId}`)
```javascript
{
  uid: string,
  displayName: string,
  photoURL: string,
  email: string,
  totalPoints: number,
  weeklyPoints: number,
  lastWeekReset: timestamp,
  badges: string[],
  levelsCompleted: number,
  levelsCreated: number,
  fastestTimes: {
    level_1: number,  // time in seconds
    level_2: number,
    // ... more levels
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Levels Collection (unchanged)
```javascript
{
  userId: string,
  title: string,
  // ... existing level fields
  createdAt: string,
  likes: number,
  plays: number
}
```

## How It Works

### Weekly Reset
- Weekly points automatically reset every Monday
- The system checks on user login if a reset is needed
- Formula: If 7+ days have passed OR we've passed a Monday since last reset

### Speed Runs
- Timer starts when a level loads
- Time is recorded when the level is solved
- Only the fastest time for each level is saved
- Times are stored in seconds

### Badges
Currently tracked badges:
- `first-try`: Solved on first attempt
- `quick-solver`: Solved in 3 attempts or less

### Stats Updates
Stats are updated in real-time when:
- Points are earned (level completion)
- Badges are unlocked
- Levels are created
- Fastest time is beaten

## Testing the Leaderboard

1. **Sign in with Google** to create a user profile
2. **Play some levels** to earn points and set times
3. **View Leaderboard** from the main menu
4. **Click on any player** to view their profile
5. **Check different tabs** to see All Time, Weekly, and Speed Run rankings

## Navigation Flow

```
Main Menu → Leaderboard → View Any Player Profile → Back to Leaderboard
         ↓
         Profile (Your Own) → Back to Main Menu
```

## Customization Options

### Change Weekly Reset Day
In `src/lib/firebase.js`, modify the `initializeUserStats` function:
```javascript
// Change currentDay === 1 to your preferred day (0 = Sunday, 1 = Monday, etc.)
if (daysSinceReset >= 7 || (currentDay === 1 && lastResetDay !== 1)) {
```

### Adjust Leaderboard Size
In `src/lib/firebase.js`, change the `limit(50)` to your preferred number:
```javascript
limit(50) // Change to any number
```

### Add More Badges
1. Update badge tracking in `src/components/GameEngine.jsx`
2. Add badge icon in `src/components/Leaderboard.jsx` and `src/components/UserProfile.jsx`
3. Update `getBadgeInfo` functions with new badge details

## Known Limitations

1. **Speed Run Board**: Currently shows fastest times for Level 1 by default. You can modify the `levelId` parameter in the Leaderboard component to show different levels.

2. **Real-time Updates**: Leaderboard data is loaded when the screen opens. Users need to refresh by navigating away and back to see updated rankings.

3. **Anonymous Users**: Users who aren't signed in can still play but won't appear on leaderboards or have stats saved.

## Troubleshooting

### "Missing Index" Error
If you see this error when viewing the leaderboard:
1. Click the link in the error message to auto-create the index
2. OR deploy the indexes using `firebase deploy --only firestore:indexes`
3. Wait 2-5 minutes for indexes to build

### Stats Not Saving
1. Ensure user is signed in (check `user` object in DevTools)
2. Verify Firestore rules are deployed
3. Check browser console for errors

### Weekly Points Not Resetting
1. The reset happens on user login, not automatically
2. Check the `lastWeekReset` timestamp in Firestore
3. Verify the reset logic in `initializeUserStats()`

## Future Enhancements

Potential additions you might want to consider:
- Friends leaderboard (filter by friends)
- Monthly leaderboard
- Achievement system with more badges
- Level difficulty ratings
- Player vs Player challenges
- Seasonal leaderboards
- Clan/team system

## Files Modified

- ✅ `src/components/Leaderboard.jsx` (new)
- ✅ `src/components/UserProfile.jsx` (new)
- ✅ `src/components/MainMenu.jsx` (updated)
- ✅ `src/components/GameEngine.jsx` (updated - added timer)
- ✅ `src/App.jsx` (updated - added routes)
- ✅ `src/hooks/useGameState.js` (updated - Firebase integration)
- ✅ `src/lib/firebase.js` (updated - leaderboard functions)
- ✅ `firestore.indexes.json` (new)
- ✅ `firestore.rules` (new)

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify Firebase indexes are built
3. Ensure security rules are deployed
4. Check that the user is signed in with Google
