import { Trophy, Wand2, X, Play, Home } from 'lucide-react';

const LevelBrowser = ({ customLevels, onPlayLevel, onDeleteLevel, onCreateNew, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 mb-6 border-2 border-purple-500">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 p-3 rounded-xl">
                <Trophy className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  My Custom Levels
                </h1>
                <p className="text-purple-200 mt-1">{customLevels.length} levels created</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCreateNew}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <Wand2 size={20} />
                Create New
              </button>
              <button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
              >
                <Home size={20} />
                Menu
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {customLevels.length === 0 ? (
          <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-12 border-2 border-gray-600 text-center">
            <Wand2 className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-300 mb-2">No levels yet!</h2>
            <p className="text-gray-400 mb-6">Create your first custom equation challenge</p>
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
          </div>
        ) : (
          /* Level Cards */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customLevels.map((level, idx) => (
              <div
                key={level.id}
                className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500 hover:border-pink-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{level.title}</h3>
                    <p className="text-purple-300 text-sm">by {level.creator}</p>
                    <p className="text-gray-400 text-xs">{level.createdAt}</p>
                  </div>
                  <button
                    onClick={() => onDeleteLevel(level.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="bg-gray-900 bg-opacity-60 p-4 rounded-lg mb-4">
                  <p className="text-gray-300 text-sm line-clamp-3">{level.story}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="bg-purple-900 bg-opacity-30 px-3 py-2 rounded">
                    <p className="text-white font-mono text-sm">{level.eq1}</p>
                  </div>
                  <div className="bg-pink-900 bg-opacity-30 px-3 py-2 rounded">
                    <p className="text-white font-mono text-sm">{level.eq2}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => onPlayLevel(level, idx)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Play size={20} />
                  Play Level
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelBrowser;
