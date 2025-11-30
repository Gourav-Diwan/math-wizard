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
            Save Your Progress!
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
