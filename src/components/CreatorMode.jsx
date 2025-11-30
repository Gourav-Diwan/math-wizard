import { useState, useEffect } from 'react';
import { Wand2, Save, Home, Skull, Heart, Trophy, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const creatorTemplates = [
  { 
    id: 'kills-deaths', 
    icon: Skull, 
    name: 'Game Stats',
    color: 'purple',
    examples: { 
      xLabel: 'Kills', 
      yLabel: 'Deaths', 
      story: 'A player finished 100 rounds with 20 more kills than deaths.',
      title: 'Epic Battle Stats'
    }
  },
  { 
    id: 'health-shield', 
    icon: Heart, 
    name: 'Health & Shields',
    color: 'green',
    examples: { 
      xLabel: 'Health', 
      yLabel: 'Shield', 
      story: 'Your character has 100 protection points with health 20 higher than shield.',
      title: 'Shield Challenge'
    }
  },
  { 
    id: 'sports', 
    icon: Trophy, 
    name: 'Sports Stats',
    color: 'orange',
    examples: { 
      xLabel: 'Shots Made', 
      yLabel: 'Shots Missed', 
      story: 'You took 100 total shots with 20 more makes than misses.',
      title: 'Basketball Challenge'
    }
  },
  { 
    id: 'time-challenge', 
    icon: Clock, 
    name: 'Time Challenge',
    color: 'blue',
    examples: { 
      xLabel: 'Fast Time', 
      yLabel: 'Slow Time', 
      story: 'Two players finished in 100 seconds combined with a 20 second difference.',
      title: 'Speed Run'
    }
  }
];

const CreatorMode = ({ onSave, onBack }) => {
  const { user } = useAuth();
  const [scenarioType, setScenarioType] = useState('kills-deaths');
  const [storyText, setStoryText] = useState('');
  const [total, setTotal] = useState(100);
  const [difference, setDifference] = useState(20);
  const [xLabel, setXLabel] = useState('Kills');
  const [yLabel, setYLabel] = useState('Deaths');
  const [levelTitle, setLevelTitle] = useState('My Custom Level');
  const [creatorName, setCreatorName] = useState('');

  // Auto-fill creator name from signed-in user
  useEffect(() => {
    if (user && !creatorName) {
      setCreatorName(user.displayName || 'Anonymous');
    }
  }, [user, creatorName]);

  const loadTemplate = (template) => {
    setScenarioType(template.id);
    setXLabel(template.examples.xLabel);
    setYLabel(template.examples.yLabel);
    setLevelTitle(template.examples.title);
    setStoryText(template.examples.story);
  };

  const calculateSolution = () => {
    const x = (total + difference) / 2;
    const y = (total - difference) / 2;
    return { x, y };
  };

  const handleSave = () => {
    const solution = calculateSolution();
    const level = {
      title: levelTitle,
      creator: creatorName || user?.displayName || 'Anonymous',
      scenarioType,
      story: storyText,
      eq1: `x + y = ${total}`,
      eq2: `x - y = ${difference}`,
      eq1Text: 'Equation 1',
      eq2Text: 'Equation 2',
      xLabel,
      yLabel,
      solution,
      total,
      diff: difference
    };
    
    onSave(level);
  };

  const solution = calculateSolution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 mb-6 border-2 border-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 p-3 rounded-xl">
                <Wand2 className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Creator Mode
                </h1>
                <p className="text-purple-200 mt-1">Design your own equation challenge!</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2"
            >
              <Home size={20} />
              Menu
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Level Info */}
            <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500">
              <h2 className="text-2xl font-bold text-blue-300 mb-4">📝 Level Info</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Level Title</label>
                  <input
                    type="text"
                    value={levelTitle}
                    onChange={(e) => setLevelTitle(e.target.value)}
                    className="w-full bg-blue-900 bg-opacity-50 border-2 border-blue-400 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Epic Challenge"
                  />
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full bg-blue-900 bg-opacity-50 border-2 border-blue-400 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Creator name"
                  />
                </div>
              </div>
            </div>

            {/* Theme Selection */}
            <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500">
              <h2 className="text-2xl font-bold text-green-300 mb-4">🎮 Choose Theme</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {creatorTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        scenarioType === template.id
                          ? 'bg-purple-600 bg-opacity-50 border-purple-400 ring-4 ring-purple-500'
                          : 'bg-gray-800 bg-opacity-50 border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Icon className={scenarioType === template.id ? 'text-purple-300' : 'text-gray-400'} size={32} />
                      <p className={`mt-2 font-semibold text-sm ${scenarioType === template.id ? 'text-white' : 'text-gray-300'}`}>
                        {template.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Numbers */}
            <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-yellow-500">
              <h2 className="text-2xl font-bold text-yellow-300 mb-4">🔢 Set Numbers</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">
                    Total (x + y = ?)
                  </label>
                  <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(parseInt(e.target.value) || 0)}
                    className="w-full bg-yellow-900 bg-opacity-50 border-2 border-yellow-400 rounded-lg px-4 py-3 text-white text-xl font-mono focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">
                    Difference (x - y = ?)
                  </label>
                  <input
                    type="number"
                    value={difference}
                    onChange={(e) => setDifference(parseInt(e.target.value) || 0)}
                    className="w-full bg-yellow-900 bg-opacity-50 border-2 border-yellow-400 rounded-lg px-4 py-3 text-white text-xl font-mono focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-500">
                  <p className="text-green-300 font-semibold mb-1">✓ Solution:</p>
                  <p className="text-white font-mono">x = {solution.x}</p>
                  <p className="text-white font-mono">y = {solution.y}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Story */}
            <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-pink-500">
              <h2 className="text-2xl font-bold text-pink-300 mb-4">📖 Write Story</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Label for X</label>
                  <input
                    type="text"
                    value={xLabel}
                    onChange={(e) => setXLabel(e.target.value)}
                    className="w-full bg-pink-900 bg-opacity-50 border-2 border-pink-400 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Kills, Health"
                  />
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">Label for Y</label>
                  <input
                    type="text"
                    value={yLabel}
                    onChange={(e) => setYLabel(e.target.value)}
                    className="w-full bg-pink-900 bg-opacity-50 border-2 border-pink-400 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Deaths, Shield"
                  />
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">Story</label>
                  <textarea
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    className="w-full bg-pink-900 bg-opacity-50 border-2 border-pink-400 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 h-40"
                    placeholder="Write your story..."
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-orange-500">
              <h2 className="text-2xl font-bold text-orange-300 mb-4">👁️ Preview</h2>
              
              <div className="bg-gray-900 bg-opacity-60 p-5 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">{levelTitle}</h3>
                <p className="text-gray-300 mb-4">{storyText || 'Your story will appear here...'}</p>
                
                <div className="space-y-2">
                  <div className="bg-purple-900 bg-opacity-40 p-3 rounded-lg">
                    <p className="text-white font-mono">x + y = {total}</p>
                  </div>
                  <div className="bg-pink-900 bg-opacity-40 p-3 rounded-lg">
                    <p className="text-white font-mono">x - y = {difference}</p>
                  </div>
                </div>
                
                <p className="text-yellow-300 font-semibold mt-4">
                  Find {xLabel} (x) and {yLabel} (y)!
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!storyText || !levelTitle}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Save size={24} />
                Save Level
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorMode;