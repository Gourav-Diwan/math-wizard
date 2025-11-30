import { useState, useEffect } from 'react';
import { Trophy, Medal, Clock, Target, Home, Sparkles, Zap, Award, Star } from 'lucide-react';
import { getUserStats, getUserRank } from '../lib/firebase';

const UserProfile = ({ user, profileUser, onBack }) => {
  const [stats, setStats] = useState(null);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use profileUser if provided (viewing another user), otherwise use current user
  const displayUser = profileUser || user;

  useEffect(() => {
    if (displayUser) {
      loadUserProfile();
    }
  }, [displayUser]);

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userStats, userRank] = await Promise.all([
        getUserStats(displayUser.uid),
        getUserRank(displayUser.uid)
      ]);
      setStats(userStats);
      setRank(userRank);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeInfo = (badgeId) => {
    switch (badgeId) {
      case 'first-try':
        return {
          icon: <Sparkles size={24} className="text-yellow-300" />,
          name: 'First Try Legend',
          color: 'from-yellow-600 to-orange-600'
        };
      case 'quick-solver':
        return {
          icon: <Zap size={24} className="text-purple-300" />,
          name: 'Speed Demon',
          color: 'from-purple-600 to-pink-600'
        };
      default:
        return {
          icon: <Award size={24} className="text-gray-300" />,
          name: 'Badge',
          color: 'from-gray-600 to-gray-800'
        };
    }
  };

  const isOwnProfile = user && displayUser && user.uid === displayUser.uid;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
          <p className="text-purple-300 mt-4 text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-black bg-opacity-50 backdrop-blur-xl rounded-3xl p-8 border-2 border-red-500 text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={onBack}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500 shadow-2xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {displayUser.photoURL ? (
                <img
                  src={displayUser.photoURL}
                  alt={displayUser.displayName}
                  className="w-20 h-20 rounded-full border-4 border-purple-500"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border-4 border-purple-500">
                  <Trophy size={40} className="text-white" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                  {displayUser.displayName || 'Anonymous'}
                </h1>
                <p className="text-purple-200 text-lg mt-1">
                  {isOwnProfile ? 'Your Profile' : 'Player Profile'}
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Home size={20} />
              Back
            </button>
          </div>

          {/* Rank Display */}
          {rank && (
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-xl">
              <div className="flex items-center justify-center gap-3">
                <Medal size={32} className="text-yellow-200" />
                <div className="text-center">
                  <p className="text-yellow-100 text-sm">Global Rank</p>
                  <p className="text-white font-bold text-2xl">#{rank}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Total Points */}
          <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-xl">
                <Trophy size={32} className="text-white" />
              </div>
              <div>
                <p className="text-purple-300 text-sm">Total Points</p>
                <p className="text-white font-bold text-3xl">{stats.totalPoints || 0}</p>
              </div>
            </div>
          </div>

          {/* Weekly Points */}
          <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-xl">
                <Target size={32} className="text-white" />
              </div>
              <div>
                <p className="text-green-300 text-sm">Weekly Points</p>
                <p className="text-white font-bold text-3xl">{stats.weeklyPoints || 0}</p>
              </div>
            </div>
          </div>

          {/* Levels Completed */}
          <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-4 rounded-xl">
                <Star size={32} className="text-white" />
              </div>
              <div>
                <p className="text-blue-300 text-sm">Levels Completed</p>
                <p className="text-white font-bold text-3xl">{stats.levelsCompleted || 0}</p>
              </div>
            </div>
          </div>

          {/* Levels Created */}
          <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-orange-500 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-orange-600 to-yellow-600 p-4 rounded-xl">
                <Award size={32} className="text-white" />
              </div>
              <div>
                <p className="text-orange-300 text-sm">Levels Created</p>
                <p className="text-white font-bold text-3xl">{stats.levelsCreated || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
            <Award size={28} />
            Badges Earned
          </h2>
          {stats.badges && stats.badges.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {stats.badges.map((badgeId, index) => {
                const badge = getBadgeInfo(badgeId);
                return (
                  <div
                    key={index}
                    className={`bg-gradient-to-r ${badge.color} p-4 rounded-xl flex items-center gap-3 shadow-lg`}
                  >
                    {badge.icon}
                    <span className="text-white font-semibold text-lg">{badge.name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400">No badges yet. Keep playing to earn some!</p>
            </div>
          )}
        </div>

        {/* Fastest Times Section */}
        <div className="bg-black bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500 shadow-xl">
          <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center gap-2">
            <Clock size={28} />
            Fastest Times
          </h2>
          {stats.fastestTimes && Object.keys(stats.fastestTimes).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.fastestTimes)
                .sort((a, b) => a[1] - b[1])
                .map(([levelId, time], index) => (
                  <div
                    key={index}
                    className="bg-blue-900 bg-opacity-30 p-4 rounded-xl border border-blue-400 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                        <Clock size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-blue-200 font-semibold">
                          Level {levelId.replace('level_', '')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-xl">{time}s</p>
                      <p className="text-blue-300 text-sm">Record time</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400">No speed records yet. Start racing!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
