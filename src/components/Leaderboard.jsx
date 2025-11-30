import { useState, useEffect } from 'react';
import { Trophy, Medal, Clock, Target, Home, User, Sparkles, Zap } from 'lucide-react';
import { getLeaderboard, getWeeklyLeaderboard, getSpeedRunBoard } from '../lib/firebase';

const Leaderboard = ({ user, onBack, onViewProfile }) => {
  const [activeTab, setActiveTab] = useState('allTime'); // 'allTime', 'weekly', 'speedRuns'
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [activeTab]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (activeTab === 'allTime') {
        data = await getLeaderboard();
      } else if (activeTab === 'weekly') {
        data = await getWeeklyLeaderboard();
      } else if (activeTab === 'speedRuns') {
        data = await getSpeedRunBoard();
      }
      setLeaderboardData(data);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badgeId) => {
    switch (badgeId) {
      case 'first-try':
        return <Sparkles size={14} className="text-yellow-300" />;
      case 'quick-solver':
        return <Zap size={14} className="text-purple-300" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-500 to-orange-500';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-600 to-orange-800';
    return 'from-purple-600 to-pink-600';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-3xl p-8 border-2 border-yellow-500 shadow-2xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-xl">
                <Trophy size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400">
                  Leaderboard
                </h1>
                <p className="text-yellow-200 text-lg mt-1">Top mathematicians in the galaxy!</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Home size={20} />
              Menu
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('allTime')}
              className={`flex-1 min-w-[150px] py-4 px-6 rounded-xl font-bold transition-all transform hover:scale-105 ${
                activeTab === 'allTime'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-opacity-70'
              }`}
            >
              <Trophy size={20} className="inline mr-2" />
              All Time
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 min-w-[150px] py-4 px-6 rounded-xl font-bold transition-all transform hover:scale-105 ${
                activeTab === 'weekly'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-opacity-70'
              }`}
            >
              <Target size={20} className="inline mr-2" />
              This Week
            </button>
            <button
              onClick={() => setActiveTab('speedRuns')}
              className={`flex-1 min-w-[150px] py-4 px-6 rounded-xl font-bold transition-all transform hover:scale-105 ${
                activeTab === 'speedRuns'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-gray-700 bg-opacity-50 text-gray-300 hover:bg-opacity-70'
              }`}
            >
              <Clock size={20} className="inline mr-2" />
              Speed Runs
            </button>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-500 shadow-2xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="text-purple-300 mt-4 text-lg">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">{error}</p>
              <button
                onClick={loadLeaderboard}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl"
              >
                Try Again
              </button>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center py-12">
              <Trophy size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">No players yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboardData.map((player, index) => {
                const rank = index + 1;
                const isCurrentUser = user && player.uid === user.uid;

                return (
                  <div
                    key={player.uid || index}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-102 ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400 shadow-lg'
                        : 'bg-gray-900 bg-opacity-50 border-gray-700 hover:border-purple-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRankColor(rank)} flex items-center justify-center font-bold text-white text-xl shadow-lg`}>
                        {getRankIcon(rank)}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-lg ${isCurrentUser ? 'text-white' : 'text-purple-300'}`}>
                            {player.displayName || 'Anonymous'}
                          </h3>
                          {isCurrentUser && (
                            <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                              YOU
                            </span>
                          )}
                        </div>

                        {/* Badges */}
                        {player.badges && player.badges.length > 0 && (
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {player.badges.map((badge, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                {getBadgeIcon(badge)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        {activeTab === 'allTime' && (
                          <div>
                            <p className={`text-2xl font-bold ${isCurrentUser ? 'text-white' : 'text-yellow-300'}`}>
                              {player.totalPoints || 0}
                            </p>
                            <p className={`text-sm ${isCurrentUser ? 'text-yellow-100' : 'text-gray-400'}`}>
                              points
                            </p>
                          </div>
                        )}
                        {activeTab === 'weekly' && (
                          <div>
                            <p className={`text-2xl font-bold ${isCurrentUser ? 'text-white' : 'text-green-300'}`}>
                              {player.weeklyPoints || 0}
                            </p>
                            <p className={`text-sm ${isCurrentUser ? 'text-green-100' : 'text-gray-400'}`}>
                              this week
                            </p>
                          </div>
                        )}
                        {activeTab === 'speedRuns' && (
                          <div>
                            <p className={`text-2xl font-bold ${isCurrentUser ? 'text-white' : 'text-blue-300'}`}>
                              {player.fastestTime ? `${player.fastestTime}s` : 'N/A'}
                            </p>
                            <p className={`text-sm ${isCurrentUser ? 'text-blue-100' : 'text-gray-400'}`}>
                              {player.levelName || 'Level 1'}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Profile Button */}
                      <button
                        onClick={() => onViewProfile(player)}
                        className={`p-3 rounded-lg transition-all transform hover:scale-110 ${
                          isCurrentUser
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-yellow-900'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        <User size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* User's Rank (if not in top list) */}
        {user && !loading && leaderboardData.length > 0 && !leaderboardData.find(p => p.uid === user.uid) && (
          <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 border-2 border-purple-400 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Medal size={32} className="text-yellow-300" />
                <div>
                  <p className="text-purple-100 text-sm">Your Rank</p>
                  <p className="text-white font-bold text-xl">Keep playing to rank up!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
