import { useState, useEffect } from 'react';
import { Trophy, Zap, Target, Sparkles, Home } from 'lucide-react';
import Graph from './Graph';

const GameEngine = ({
  level,
  levelIndex,
  playingCustom,
  totalPoints,
  badges,
  onAddPoints,
  onAddBadge,
  onNextLevel,
  onRetry,
  onBack,
  onLevelComplete,
  builtInTemplates
}) => {
  const [xGuess, setXGuess] = useState('');
  const [yGuess, setYGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [points, setPoints] = useState(0);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    generateGraphData();
    resetState();
    setStartTime(Date.now());
  }, [level]);

  const generateGraphData = () => {
    const data = [];
    const maxVal = Math.max(level.solution.x, level.solution.y) * 2;
    const minVal = Math.min(0, level.solution.x * -0.5, level.solution.y * -0.5);
    
    for (let x = minVal; x <= maxVal; x += (maxVal - minVal) / 100) {
      let y1 = level.total - x;
      let y2 = x - level.diff;
      
      if (y1 < minVal || y1 > maxVal) y1 = null;
      if (y2 < minVal || y2 > maxVal) y2 = null;
      
      data.push({
        x: Math.round(x * 10) / 10,
        y1: y1,
        y2: y2
      });
    }
    setGraphData(data);
  };

  const resetState = () => {
    setXGuess('');
    setYGuess('');
    setAttempts(0);
    setPoints(0);
    setSolved(false);
    setFeedback('');
    setShowHint(false);
    setShowSolution(false);
    setShowCelebration(false);
  };

  const checkSolution = () => {
    const x = parseFloat(xGuess);
    const y = parseFloat(yGuess);
    
    setAttempts(attempts + 1);
    
    if (isNaN(x) || isNaN(y)) {
      setFeedback('Please enter numbers for both values!');
      return;
    }
    
    const tolerance = 0.5;
    if (Math.abs(x - level.solution.x) < tolerance && Math.abs(y - level.solution.y) < tolerance) {
      setSolved(true);
      const earnedPoints = Math.max(100 - (attempts * 10), 50);
      setPoints(earnedPoints);
      onAddPoints(earnedPoints);
      setShowCelebration(true);

      // Calculate solve time in seconds
      const solveTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

      // Call completion callback with level info and time
      if (onLevelComplete) {
        onLevelComplete(levelIndex, solveTime);
      }

      if (attempts === 0 && !badges.includes('first-try')) {
        onAddBadge('first-try');
        setFeedback(`🧙‍♂️ WIZARD PRODIGY! Perfect on first try! +${earnedPoints} magic points!`);
      } else if (attempts <= 2 && !badges.includes('quick-solver')) {
        onAddBadge('quick-solver');
        setFeedback(`⚡ LIGHTNING WIZARD! Solved in ${attempts + 1} tries! +${earnedPoints} magic points!`);
      } else {
        setFeedback(`✨ SPELL MASTERED! Solved in ${attempts + 1} attempts! +${earnedPoints} magic points!`);
      }

      setTimeout(() => setShowCelebration(false), 3000);
    } else {
      const eq1Error = Math.abs((x + y) - level.total);
      const eq2Error = Math.abs((x - y) - level.diff);
      
      if (eq1Error < 5 && eq2Error < 5) {
        setFeedback('🔥 SO CLOSE! Almost at the intersection!');
      } else if (eq1Error < 10 || eq2Error < 10) {
        setFeedback('⚡ Getting warmer! One equation is nearly right.');
      } else {
        setFeedback('🎯 Keep trying! Both equations must be satisfied.');
      }
    }
  };

  const showMeSolution = () => {
    setShowSolution(true);
    setFeedback('📚 Learning mode - No points, but master the strategy!');
  };

  const colorScheme = {
    purple: { primary: 'purple', secondary: 'pink', line1: '#a855f7', line2: '#ec4899' },
    green: { primary: 'green', secondary: 'emerald', line1: '#10b981', line2: '#34d399' },
    red: { primary: 'red', secondary: 'orange', line1: '#ef4444', line2: '#f97316' },
    blue: { primary: 'blue', secondary: 'cyan', line1: '#3b82f6', line2: '#06b6d4' },
    orange: { primary: 'orange', secondary: 'yellow', line1: '#f97316', line2: '#eab308' }
  };

  const colors = colorScheme[level.template.color] || colorScheme.purple;
  const Icon = level.template.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-9xl animate-bounce">🎉</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 mb-6 border-2 border-purple-500 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 p-4 rounded-xl">
                <Icon className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                  {playingCustom ? level.title : `Level ${levelIndex + 1}: ${level.template.title}`}
                </h1>
                <p className="text-purple-200 mt-1">
                  {playingCustom ? `by ${level.creator}` : 'Master the math, dominate the game! 🎮'}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center flex-wrap">
              <button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <Home size={20} />
                Menu
              </button>
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="text-yellow-200" size={24} />
                  <div>
                    <div className="text-yellow-100 text-xs">Total Score</div>
                    <div className="text-white font-bold text-xl">{totalPoints}</div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-600 bg-opacity-60 px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Zap className="text-yellow-300" size={24} />
                  <div>
                    <div className="text-white text-xs">This Level</div>
                    <div className="text-white font-bold text-xl">{points} pts</div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-600 bg-opacity-60 px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Target className="text-blue-200" size={24} />
                  <div>
                    <div className="text-white text-xs">Attempts</div>
                    <div className="text-white font-bold text-xl">{attempts}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {badges.includes('first-try') && (
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                  <Sparkles size={16} className="text-yellow-200" />
                  <span className="text-white font-semibold text-sm">Wizard Prodigy</span>
                </div>
              )}
              {badges.includes('quick-solver') && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                  <Zap size={16} className="text-purple-200" />
                  <span className="text-white font-semibold text-sm">Lightning Wizard</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Game Area */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Section */}
          <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500 shadow-2xl">
            <h2 className="text-3xl font-bold text-blue-300 mb-4 flex items-center gap-2">
              <Icon size={28} />
              The Challenge
            </h2>
            <div className="bg-purple-900 bg-opacity-40 p-5 rounded-xl mb-6 border border-purple-400">
              <p className="text-white text-lg leading-relaxed">
                {level.story}
                <br /><br />
                <span className="text-yellow-300 font-bold text-xl">
                  Find {level.xLabel} (x) and {level.yLabel} (y)!
                </span>
              </p>
            </div>

            {/* Equations */}
            <div className="space-y-3 mb-6">
              <div className="bg-purple-900 bg-opacity-50 p-5 rounded-xl border-2 border-purple-400">
                <p className="text-purple-200 text-sm mb-2 font-semibold">{level.eq1Text}</p>
                <p className="text-white text-2xl font-mono font-bold">{level.eq1}</p>
              </div>
              <div className="bg-pink-900 bg-opacity-50 p-5 rounded-xl border-2 border-pink-400">
                <p className="text-pink-200 text-sm mb-2 font-semibold">{level.eq2Text}</p>
                <p className="text-white text-2xl font-mono font-bold">{level.eq2}</p>
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="text-purple-300 font-bold mb-2 block text-lg">
                  {level.xLabel} (x):
                </label>
                <input
                  type="number"
                  value={xGuess}
                  onChange={(e) => setXGuess(e.target.value)}
                  disabled={solved || showSolution}
                  className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-xl px-5 py-4 text-white text-2xl font-mono focus:outline-none focus:ring-4 focus:ring-purple-500"
                  placeholder="Your answer..."
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-pink-300 font-bold mb-2 block text-lg">
                  {level.yLabel} (y):
                </label>
                <input
                  type="number"
                  value={yGuess}
                  onChange={(e) => setYGuess(e.target.value)}
                  disabled={solved || showSolution}
                  className="w-full bg-pink-900 bg-opacity-60 border-2 border-pink-400 rounded-xl px-5 py-4 text-white text-2xl font-mono focus:outline-none focus:ring-4 focus:ring-pink-500"
                  placeholder="Your answer..."
                  step="0.1"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={checkSolution}
                  disabled={solved || showSolution}
                  className="flex-1 min-w-[200px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 shadow-lg text-lg"
                >
                  {solved ? '✓ SOLVED!' : '✨ Cast Your Spell'}
                </button>
                {solved && !playingCustom && (
                  <button
                    onClick={onNextLevel}
                    className="flex-1 min-w-[200px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg"
                  >
                    Next Level →
                  </button>
                )}
                {solved && playingCustom && (
                  <button
                    onClick={onBack}
                    className="flex-1 min-w-[200px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg"
                  >
                    Back to My Levels
                  </button>
                )}
                {(solved || showSolution) && (
                  <button
                    onClick={onRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg"
                  >
                    🔄
                  </button>
                )}
              </div>

              {/* Show Solution Button */}
              {!solved && !showSolution && (
                <button
                  onClick={showMeSolution}
                  className="w-full bg-orange-600 bg-opacity-50 hover:bg-opacity-70 text-orange-100 font-semibold py-3 px-4 rounded-xl transition-all border-2 border-orange-500"
                >
                  🔮 Reveal the Magic (No Points)
                </button>
              )}

              {/* Hint Button */}
              {!solved && !showSolution && attempts > 2 && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full bg-yellow-600 bg-opacity-40 hover:bg-opacity-60 text-yellow-200 font-semibold py-3 px-4 rounded-xl transition-all border-2 border-yellow-500"
                >
                  {showHint ? 'Hide the Oracle' : '🔮 Summon the Oracle?'}
                </button>
              )}

              {/* Hint */}
              {showHint && (
                <div className="bg-yellow-900 bg-opacity-40 p-4 rounded-xl border-2 border-yellow-500">
                  <p className="text-yellow-100">
                    <strong>Strategy:</strong> Add both equations together! The y terms will cancel out, giving you 2x = {level.total + level.diff}.
                  </p>
                </div>
              )}

              {/* Solution Walkthrough */}
              {showSolution && (
                <div className="bg-orange-900 bg-opacity-50 p-6 rounded-xl border-2 border-orange-500 space-y-4 max-h-96 overflow-y-auto">
                  <h3 className="text-2xl font-bold text-orange-200 flex items-center gap-2">
                    📖 Step-by-Step Solution
                  </h3>
                  
                  <div className="space-y-3 text-orange-100">
                    <div className="bg-black bg-opacity-40 p-4 rounded-lg">
                      <p className="font-semibold text-orange-300 mb-2">Step 1: Write equations</p>
                      <p className="font-mono text-lg">{level.eq1}</p>
                      <p className="font-mono text-lg">{level.eq2}</p>
                    </div>

                    <div className="bg-black bg-opacity-40 p-4 rounded-lg">
                      <p className="font-semibold text-orange-300 mb-2">Step 2: Add equations</p>
                      <p className="font-mono text-lg">2x = {level.total + level.diff}</p>
                      <p className="text-sm text-orange-200 mt-1">The y terms cancel!</p>
                    </div>

                    <div className="bg-black bg-opacity-40 p-4 rounded-lg">
                      <p className="font-semibold text-orange-300 mb-2">Step 3: Solve for x</p>
                      <p className="font-mono text-lg">x = {(level.total + level.diff) / 2}</p>
                      <p className="font-mono text-lg text-green-400">x = {level.solution.x}</p>
                    </div>

                    <div className="bg-black bg-opacity-40 p-4 rounded-lg">
                      <p className="font-semibold text-orange-300 mb-2">Step 4: Find y</p>
                      <p className="font-mono text-lg">{level.solution.x} + y = {level.total}</p>
                      <p className="font-mono text-lg text-green-400">y = {level.solution.y}</p>
                    </div>

                    <div className="bg-green-900 bg-opacity-50 p-4 rounded-lg border-2 border-green-500">
                      <p className="font-semibold text-green-300 mb-2">✓ Verify:</p>
                      <p className="font-mono">{level.solution.x} + {level.solution.y} = {level.total} ✓</p>
                      <p className="font-mono">{level.solution.x} - {level.solution.y} = {level.diff} ✓</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div className={`p-5 rounded-xl border-2 ${
                  solved 
                    ? 'bg-green-900 bg-opacity-50 border-green-400' 
                    : 'bg-blue-900 bg-opacity-50 border-blue-400'
                }`}>
                  <p className="text-white text-xl font-bold">{feedback}</p>
                </div>
              )}
            </div>
          </div>

          {/* Graph Section */}
          <Graph
            graphData={graphData}
            colors={colors}
            levelData={level}
            xGuess={xGuess}
            yGuess={yGuess}
            solved={solved}
            showSolution={showSolution}
          />
        </div>

        {/* Progress Tracker for Built-in Levels */}
        {!playingCustom && (
          <div className="mt-6 bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500 shadow-2xl">
            <h3 className="text-xl font-bold text-purple-300 mb-4">🧙‍♂️ Your Wizard Journey</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {builtInTemplates.map((template, idx) => {
                const LevelIcon = template.icon;
                const isCompleted = idx < levelIndex;
                const isCurrent = idx === levelIndex;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isCompleted
                        ? 'bg-green-900 bg-opacity-50 border-green-400'
                        : isCurrent
                        ? 'bg-purple-900 bg-opacity-50 border-purple-400 ring-4 ring-purple-500'
                        : 'bg-gray-900 bg-opacity-50 border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LevelIcon 
                        size={24} 
                        className={isCompleted ? 'text-green-400' : isCurrent ? 'text-purple-400' : 'text-gray-500'}
                      />
                      <div>
                        <p className={`font-semibold ${isCompleted ? 'text-green-300' : isCurrent ? 'text-purple-300' : 'text-gray-400'}`}>
                          Level {idx + 1}
                        </p>
                        <p className={`text-xs ${isCompleted ? 'text-green-200' : isCurrent ? 'text-purple-200' : 'text-gray-500'}`}>
                          {template.title}
                        </p>
                      </div>
                      {isCompleted && <span className="ml-auto text-green-400">✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameEngine;