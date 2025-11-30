import { LogIn, LogOut, User } from 'lucide-react';
import { signInWithGoogle, logOut } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

const AuthButton = () => {
  const { user, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-600 px-4 py-2 rounded-lg">
        <span className="text-white text-sm">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-purple-600 bg-opacity-50 px-4 py-2 rounded-lg">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User size={20} className="text-white" />
          )}
          <span className="text-white text-sm font-semibold">
            {user.displayName || 'Player'}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        >
          <LogOut size={16} />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg font-semibold"
    >
      <LogIn size={20} />
      Sign in with Google
    </button>
  );
};

export default AuthButton;