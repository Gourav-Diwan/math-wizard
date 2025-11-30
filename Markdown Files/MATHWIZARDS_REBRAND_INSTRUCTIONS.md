# 🧙‍♂️ Mathwizards Rebranding Instructions for Claude Code

## Project Overview
Rebrand "Equation Adventure" to "Mathwizards.io" throughout the entire codebase with wizard-themed UI enhancements.

---

## Phase 1: Text & Branding Updates

### 1.1 Update index.html
**File**: `index.html`

**Changes**:
- Title: Change from "Equation Adventure" to "Mathwizards"
- Update meta tags if present to reflect new branding

**Before**:
```html
<title>Equation Adventure</title>
```

**After**:
```html
<title>Mathwizards - Master Math Through Gaming</title>
```

---

### 1.2 Update Main Menu Component
**File**: `src/components/MainMenu.jsx`

**Changes**:
- Main heading: "Equation Adventure" → "Mathwizards"
- Tagline: Update to wizard theme
- Consider adding wizard emoji or icon

**Before**:
```jsx
<h1>Equation Adventure</h1>
<p>Master equations through gaming! 🎮</p>
```

**After**:
```jsx
<h1>Mathwizards</h1>
<p>Become a Math Wizard! 🧙‍♂️✨</p>
```

---

### 1.3 Update Game Engine Component
**File**: `src/components/GameEngine.jsx`

**Changes**:
- Update any references to "Equation Adventure"
- Change button text to wizard-themed language:
  - "Check Answer" → "Cast Spell" or "Solve Puzzle"
  - "Victory" messages to include wizard theme
  - "Next Level" → "Next Quest" or keep as is

**Suggested changes**:
```jsx
// Victory feedback
"🎮 VICTORY!" → "🧙‍♂️ WIZARD MASTERY!"

// Button text
"🎯 Check Answer" → "✨ Cast Your Spell"
```

---

### 1.4 Update App.jsx
**File**: `src/App.jsx`

**Changes**:
- Login screen heading: "Equation Adventure" → "Mathwizards"
- Update tagline on login page
- Add wizard-themed subtitle if desired

**Before**:
```jsx
<h1>Equation Adventure</h1>
<p>Master equations through gaming! 🎮</p>
```

**After**:
```jsx
<h1>Mathwizards</h1>
<p>Master math like a wizard! 🧙‍♂️✨</p>
```

---

### 1.5 Update README.md
**File**: `README.md`

**Changes**:
- Title: "Equation Adventure" → "Mathwizards"
- All references throughout document
- Update description to reflect wizard theme
- Update repository name references if applicable

**New intro section**:
```markdown
# Mathwizards 🧙‍♂️

Transform into a Math Wizard through interactive, game-based equation challenges!

## Features

- 🧙‍♂️ **Play Mode**: 4 magical levels with different gaming scenarios
- ✨ **Creator Mode**: Design custom wizard challenges
- 📊 **Visual Learning**: Interactive spell graphs showing solutions
- 🏆 **Wizard Badges & Magic Points**: Earn rewards for solving equations
- 💡 **Hints & Solutions**: Learn strategies when stuck
```

---

### 1.6 Update package.json
**File**: `package.json`

**Changes**:
- Name: "equation-adventure" → "mathwizards"
- Update description if present

**Before**:
```json
{
  "name": "equation-adventure",
  ...
}
```

**After**:
```json
{
  "name": "mathwizards",
  "description": "Master math through wizard-themed gaming challenges",
  ...
}
```

---

### 1.7 Update Firebase Config
**File**: `src/firebase-config.js`

**Changes**:
- Add comment noting the domain will be mathwizards.io
- Update any hardcoded references to "equation-adventure"

**Add comment**:
```javascript
// Mathwizards Configuration
// Domain: mathwizards.io
// TODO: Update authDomain after deploying to mathwizards.io
```

---

### 1.8 Update SETUP_GUIDE.md
**File**: `SETUP_GUIDE.md`

**Changes**:
- Replace all instances of "Equation Adventure" with "Mathwizards"
- Update folder name references: "equation-adventure" → "mathwizards"
- Update GitHub repository name suggestions
- Update Vercel deployment URLs to reference mathwizards

**Example changes**:
```bash
# Before
mkdir equation-adventure
cd equation-adventure

# After
mkdir mathwizards
cd mathwizards
```

---

## Phase 2: UI & Theme Enhancements (Optional but Recommended)

### 2.1 Add Wizard Icon/Emoji
**Files**: `MainMenu.jsx`, `App.jsx`, `GameEngine.jsx`

**Enhancement**: Add wizard hat emoji or wizard-themed icons throughout

**Suggestions**:
- 🧙‍♂️ - Main wizard
- ✨ - Magic/sparkles
- 🔮 - Crystal ball
- 📜 - Spell scroll
- ⚡ - Lightning/power
- 🎩 - Wizard hat

**Example implementation**:
```jsx
// In MainMenu.jsx title
<h1>
  <span className="inline-block mr-2">🧙‍♂️</span>
  Mathwizards
  <span className="inline-block ml-2">✨</span>
</h1>
```

---

### 2.2 Update Color Scheme (Optional)
**Files**: Various components

**Wizard Theme Colors**:
- Primary: Purple/Violet (already using)
- Accent: Gold/Yellow (for magic)
- Secondary: Deep blue (for mystical feel)

**Current gradient is good, optionally add gold accents**:
```jsx
// Add gold highlights to points/badges
className="from-yellow-600 to-orange-600" // Keep this
className="from-purple-600 to-indigo-600" // Magic purple
```

---

### 2.3 Update Badge Names
**File**: `src/hooks/useGameState.js` or wherever badges are defined

**Current badges** → **Wizard-themed badges**:
- "First Try Legend" → "Wizard Prodigy" or "Master Sorcerer"
- "Speed Demon" → "Lightning Wizard" or "Spell Caster"

**Implementation**:
```jsx
// In GameEngine.jsx, update badge text
badges.includes('first-try') && (
  <div>
    <Sparkles size={16} />
    <span>Wizard Prodigy</span> // Changed from "First Try Legend"
  </div>
)

badges.includes('quick-solver') && (
  <div>
    <Zap size={16} />
    <span>Lightning Wizard</span> // Changed from "Speed Demon"
  </div>
)
```

---

### 2.4 Update Victory Messages
**File**: `src/components/GameEngine.jsx`

**Current** → **Wizard-themed**:
- "🎮 VICTORY!" → "🧙‍♂️ SPELL MASTERED!"
- "SOLVED!" → "WIZARD POWER UNLOCKED!"
- Points messaging: Add "Magic Points" or "Wizard XP"

**Example**:
```jsx
if (attempts === 0) {
  setFeedback(`🧙‍♂️ WIZARD PRODIGY! Perfect on first try! +${earnedPoints} magic points!`);
} else if (attempts <= 2) {
  setFeedback(`⚡ LIGHTNING WIZARD! Solved in ${attempts + 1} tries! +${earnedPoints} magic points!`);
} else {
  setFeedback(`✨ SPELL MASTERED! Solved in ${attempts + 1} attempts! +${earnedPoints} magic points!`);
}
```

---

### 2.5 Update Button Text (Optional)
**File**: `src/components/GameEngine.jsx`

**Wizard-themed button text**:
- "Check Answer" → "Cast Spell" or "Solve Puzzle"
- "Show Me How to Solve It" → "Show Me the Magic" or "Reveal the Spell"
- "Need a Hint?" → "Summon a Hint?" or "Ask the Oracle?"

**Example**:
```jsx
<button onClick={checkSolution}>
  ✨ Cast Your Spell
</button>

<button onClick={showMeSolution}>
  🔮 Reveal the Magic (No Points)
</button>

<button onClick={() => setShowHint(!showHint)}>
  {showHint ? 'Hide the Oracle' : '🔮 Summon the Oracle?'}
</button>
```

---

### 2.6 Update Level Progress Language
**File**: `src/components/GameEngine.jsx`

**Change**: "Your Progress" → "Your Wizard Journey" or "Quest Progress"

**Example**:
```jsx
<h3>🧙‍♂️ Your Wizard Journey</h3>
```

---

## Phase 3: Authentication Updates

### 3.1 Apple Sign-In Configuration
**Action Required**: Update Apple Developer Console

**Steps**:
1. Go to Apple Developer Console
2. Find your Services ID for the app
3. Update Return URLs from:
   - `https://equation-adventure.firebaseapp.com/__/auth/handler`
   
   To (when domain is ready):
   - `https://mathwizards.io/__/auth/handler`
   - `https://mathwizards.firebaseapp.com/__/auth/handler`

4. Update Domains from:
   - `equation-adventure.firebaseapp.com`
   
   To:
   - `mathwizards.io`
   - `mathwizards.firebaseapp.com`

**Note**: Keep old URLs until domain migration is complete, then remove

---

### 3.2 Firebase Project Rename (Optional)
**Action**: Consider renaming Firebase project

**Options**:
1. **Keep existing project**: Just update hosting to use mathwizards.io domain
2. **Create new project**: 
   - Name: "mathwizards"
   - Migrate settings from equation-adventure
   - Update all auth providers

**Recommendation**: Keep existing project, just update custom domain

---

### 3.3 Update Firebase Hosting Domain
**Action Required**: Add custom domain in Firebase

**Steps**:
1. Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter: `mathwizards.io`
4. Follow DNS verification steps
5. Update `firebase.json` if needed

---

## Phase 4: Git & Repository Updates

### 4.1 Update .gitignore (if needed)
**File**: `.gitignore`

**Verify**: No changes needed unless adding new files

---

### 4.2 Update Git Repository Name
**Action**: Rename GitHub repository

**Steps**:
1. Go to GitHub repository settings
2. Change name from "equation-adventure" to "mathwizards"
3. Update local remote:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/mathwizards.git
```

---

### 4.3 Create Deployment Checklist
**New File**: `DEPLOYMENT.md`

**Content**:
```markdown
# Mathwizards Deployment Checklist

## Domain Setup
- [ ] Purchase mathwizards.io domain
- [ ] Configure DNS for Firebase Hosting
- [ ] Verify SSL certificate

## Firebase Configuration
- [ ] Add mathwizards.io as custom domain
- [ ] Update redirect URIs in Authentication settings
- [ ] Test all sign-in methods on new domain

## Apple Developer
- [ ] Update Return URLs to mathwizards.io
- [ ] Update Domains to mathwizards.io
- [ ] Test Apple Sign-In

## Final Testing
- [ ] Test on mathwizards.io (production)
- [ ] Verify all auth methods work
- [ ] Check responsive design
- [ ] Test all game levels
- [ ] Verify custom level creation/saving

## Go Live
- [ ] Update social media links (if any)
- [ ] Announce new domain
- [ ] Monitor for issues
```

---

## Phase 5: Testing Checklist

### 5.1 Local Testing
Before committing changes:

- [ ] Run `npm run dev`
- [ ] Verify all "Mathwizards" branding appears correctly
- [ ] Check all pages load without errors
- [ ] Test game functionality
- [ ] Verify no broken references to "Equation Adventure"

### 5.2 Search for Old Branding
Run these commands to find any missed references:

```bash
# Search for "Equation Adventure" in code
grep -r "Equation Adventure" src/

# Search for "equation-adventure" (lowercase)
grep -r "equation-adventure" .

# Check package.json
cat package.json | grep equation
```

---

## Phase 6: File-by-File Summary

### Files to Update:
1. ✅ `index.html` - Title and meta tags
2. ✅ `package.json` - Name and description
3. ✅ `README.md` - Complete rebrand
4. ✅ `SETUP_GUIDE.md` - All references
5. ✅ `src/App.jsx` - Login screen branding
6. ✅ `src/components/MainMenu.jsx` - Main title and theme
7. ✅ `src/components/GameEngine.jsx` - Game messages and UI
8. ✅ `src/firebase-config.js` - Comments and domain refs
9. ✅ `src/components/CreatorMode.jsx` - Any branding refs (if exists)
10. ✅ `src/components/LevelBrowser.jsx` - Any branding refs (if exists)

### Files to Create:
1. ✅ `DEPLOYMENT.md` - Deployment checklist

### Configuration to Update (After Domain Purchase):
1. ⏳ Apple Developer Console - Redirect URIs
2. ⏳ Firebase Hosting - Custom domain
3. ⏳ Firebase Authentication - Authorized domains

---

## Execution Order

### Immediate (Claude Code can do now):
1. Update all text references in code files
2. Update package.json
3. Update README.md and SETUP_GUIDE.md
4. Add wizard-themed emojis and UI enhancements
5. Update victory messages and button text
6. Create DEPLOYMENT.md checklist
7. Test locally

### After Domain Purchase:
1. Configure Firebase custom domain
2. Update Apple Developer Console
3. Update Firebase authorized domains
4. Deploy to production
5. Test all auth methods on new domain

---

## Priority Levels

### HIGH Priority (Must Do):
- ✅ Text rebrand: All "Equation Adventure" → "Mathwizards"
- ✅ Update package.json name
- ✅ Update README.md
- ✅ Update index.html title
- ✅ Test that everything still works

### MEDIUM Priority (Should Do):
- ✅ Add wizard emojis/icons
- ✅ Update victory messages to wizard theme
- ✅ Update badge names
- ✅ Update button text to be more wizard-themed

### LOW Priority (Nice to Have):
- 🔹 Custom wizard icon instead of emoji
- 🔹 Animated sparkles effect
- 🔹 Wizard avatar customization
- 🔹 Spell sound effects

---

## Expected Results

After completing this rebrand:

1. **User sees "Mathwizards" everywhere** instead of "Equation Adventure"
2. **Wizard theme** is consistent throughout the app
3. **All functionality remains the same** - just rebranded
4. **No broken links or references** to old name
5. **Repository renamed** to mathwizards
6. **Ready for domain deployment** when mathwizards.io is purchased

---

## Notes for Claude Code

- This is a **rebrand only** - no functionality changes
- Focus on **text replacement** and **theme consistency**
- Keep all existing game logic intact
- Test thoroughly after changes
- Use find/replace for efficiency but verify each change
- Maintain existing color schemes (purple/pink gradient)
- Add wizard emojis liberally but tastefully
- Keep code clean and well-commented

---

## Questions to Confirm Before Starting

1. ✅ Domain purchased yet? (If no, update configs later)
2. ✅ Keep existing Firebase project? (Recommended: Yes)
3. ✅ How wizard-themed for buttons? (Suggested: Medium - keep it professional but fun)
4. ✅ Update all documentation? (Yes - README, SETUP_GUIDE, etc.)

---

## Post-Rebrand Tasks (For Later)

After Claude Code completes the rebrand:

1. **Domain Purchase**:
   - Buy mathwizards.io
   - Configure DNS
   
2. **Apple Developer Update**:
   - Update redirect URIs
   - Test Apple Sign-In
   
3. **Firebase Hosting**:
   - Add custom domain
   - Verify SSL
   
4. **Marketing**:
   - Update social media (if any)
   - Create landing page copy
   - Design wizard-themed graphics

---

## Success Criteria

✅ All references to "Equation Adventure" removed
✅ "Mathwizards" branding consistent across all files
✅ Wizard theme emojis added appropriately
✅ All functionality still works (npm run dev successful)
✅ No console errors
✅ README and docs updated
✅ Ready for production deployment

---

## Support Files

After rebrand, keep these files:
- `DEPLOYMENT.md` - For domain deployment steps
- `SETUP_GUIDE.md` - Updated with Mathwizards branding
- `README.md` - Updated project documentation
- `MICROSOFT_SIGNIN_SETUP.md` - Keep as reference (even though not implementing)

---

## Timeline Estimate

- Text replacements: **30 minutes**
- UI enhancements: **1 hour**
- Testing: **30 minutes**
- Documentation updates: **30 minutes**
- **Total: ~2.5 hours**

---

## Final Notes

This rebrand maintains all existing functionality while giving the app a fresh, wizard-themed identity. The name "Mathwizards" better represents the gamified learning experience and provides room for future wizard-themed features like:

- Wizard levels (Apprentice → Wizard → Archmage)
- Spell collections
- Magic wands/staffs as power-ups
- Wizard duels (multiplayer?)
- Potion crafting (bonus challenges)

The foundation is being set for an engaging, wizard-themed math learning adventure! 🧙‍♂️✨
