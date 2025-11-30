# Mathwizards 🧙‍♂️

Transform into a Math Wizard through interactive, game-based equation challenges!

## Features

- 🧙‍♂️ **Play Mode**: 4 magical levels with different gaming scenarios
- ✨ **Creator Mode**: Design custom wizard challenges
- 📊 **Visual Learning**: Interactive spell graphs showing solutions
- 🏆 **Wizard Badges & Magic Points**: Earn rewards for solving equations
- 💡 **Hints & Solutions**: Learn strategies when stuck

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mathwizards
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

That's it! Vercel will automatically deploy your app.

## Project Structure

```
src/
├── components/          # React components
│   ├── MainMenu.jsx    # Main navigation
│   ├── GameEngine.jsx  # Play mode
│   ├── CreatorMode.jsx # Level creation
│   ├── LevelBrowser.jsx # Custom levels
│   └── Graph.jsx       # Visual graph component
├── data/
│   └── levelTemplates.js # Built-in level definitions
├── hooks/
│   └── useGameState.js   # Shared state management
├── App.jsx              # Main app component
└── main.jsx            # Entry point
```

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Graph visualization
- **Lucide React** - Icons

## Future Enhancements

- ✅ User authentication (implemented!)
- ✅ Cloud storage for custom levels (implemented!)
- ✅ Leaderboards (implemented!)
- 🔗 Share level codes with friends
- 🎮 More equation types (quadratic, exponential)
- 🧙‍♂️ Wizard levels (Apprentice → Wizard → Archmage)
- ⚡ Magic wands/staffs as power-ups

## Contributing

This is a family project! Feel free to add new features and levels.

## License

MIT

## Created By

A father-son team learning math and coding together! 🚀
