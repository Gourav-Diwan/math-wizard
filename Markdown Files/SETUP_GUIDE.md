# 🧙‍♂️ Mathwizards - Setup Guide

## What You Have

I've created **12 files** for you that form the complete Option A project. Now let's get it running on your computer!

---

## Step 1: Install Required Software (15 minutes)

### Install Node.js

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. Accept all defaults
5. Verify installation:
   ```bash
   node --version
   # Should show v18.x.x or higher
   ```

### Install VS Code

1. Go to [code.visualstudio.com](https://code.visualstudio.com)
2. Download for your operating system
3. Install it
4. Open VS Code

### Install Git

1. Go to [git-scm.com](https://git-scm.com)
2. Download for your operating system
3. Install with default settings
4. Verify:
   ```bash
   git --version
   ```

---

## Step 2: Create Project Folder (5 minutes)

### Option A: Using Terminal/Command Prompt

```bash
# Create project folder
mkdir mathwizards
cd mathwizards

# Initialize Git
git init

# Create folder structure
mkdir -p src/components src/data src/hooks public
```

### Option B: Using File Explorer (Easier)

1. Create a new folder called `mathwizards` on your Desktop
2. Open VS Code
3. Click `File → Open Folder`
4. Select the `mathwizards` folder

---

## Step 3: Copy Files (10 minutes)

I've created 12 files for you. You need to copy each one into your project:

### Root Level Files (in `mathwizards/` folder):
1. `package.json`
2. `vite.config.js`
3. `tailwind.config.js`
4. `.gitignore`
5. `index.html`
6. `README.md`
7. `SETUP_GUIDE.md` (this file!)

### src/ folder:
8. `src/main.jsx`
9. `src/App.jsx`
10. `src/index.css`

### src/data/ folder:
11. `src/data/levelTemplates.js`

### src/hooks/ folder:
12. `src/hooks/useGameState.js`

**How to copy:**
- Click on each artifact I created above
- Copy the content
- Create a new file in VS Code with the exact name
- Paste the content
- Save (`Ctrl+S` or `Cmd+S`)

---

## Step 4: Install Dependencies (5 minutes)

In VS Code, open the terminal:
- Mac: `Ctrl + ` ` (backtick)
- Windows: `` Ctrl + ` `` (backtick)

Then run:

```bash
npm install
```

This will download all the required packages (~2-3 minutes).

---

## Step 5: Run the App Locally (1 minute)

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open your browser to `http://localhost:5173` - YOUR APP IS RUNNING! 🎉

---

## Step 6: Complete Component Files

I still need to create the 4 main component files. Let me know when you're ready and I'll create:

1. `src/components/MainMenu.jsx` - The menu screen
2. `src/components/GameEngine.jsx` - The full game with graph
3. `src/components/CreatorMode.jsx` - Level creation interface
4. `src/components/LevelBrowser.jsx` - Custom levels browser

These are LARGE files (the full game logic from our artifact), so I'll create them separately.

---

## Step 7: Set Up Git & GitHub (10 minutes)

### Initialize Git (in terminal):

```bash
git add .
git commit -m "Initial commit - Mathwizards"
```

### Create GitHub Repository:

1. Go to [github.com](https://github.com)
2. Click the `+` icon → `New repository`
3. Name it: `mathwizards`
4. Make it **Public** (so it's free)
5. Don't initialize with README (we already have one)
6. Click `Create repository`

### Push to GitHub:

GitHub will show you commands. Run these in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/mathwizards.git
git branch -M main
git push -u origin main
```

Now your code is on GitHub! 🎉

---

## Step 8: Deploy to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click `Sign Up` → use your GitHub account
3. Click `New Project`
4. Import `mathwizards` repository
5. Vercel auto-detects settings - just click `Deploy`
6. Wait 1-2 minutes...
7. **YOU'RE LIVE!** 🚀

You'll get a URL like: `https://mathwizards-xyz.vercel.app`

Share that with anyone!

---

## Common Issues & Solutions

### "npm: command not found"
- Node.js isn't installed or not in PATH
- Restart your terminal after installing Node
- On Windows, restart your computer

### "Cannot find module 'react'"
- Run `npm install` again
- Make sure you're in the right folder (`mathwizards/`)

### "Port 5173 is already in use"
- Another app is using that port
- Close other terminals
- Or use: `npm run dev -- --port 3000`

### Blank white screen
- Check browser console (F12) for errors
- Make sure all component files are created
- Check that all imports match file names exactly

---

## What's Next?

### Right Now:
✅ Tell me when you're ready for the 4 component files
✅ I'll create them and you'll have a fully working app

### This Weekend:
✅ Test the app with your son
✅ Deploy to Vercel
✅ Share the URL with friends

### Next Week (Option B):
✅ Add Firebase for persistent storage
✅ Add user authentication
✅ Add level sharing features

---

## Need Help?

Just ask! I'm here to help you through each step.

**Ready for the component files?** Just say "Yes, create the components!" and I'll make them for you.
