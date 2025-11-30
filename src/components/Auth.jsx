import { useState } from 'react';
import { Mail, Lock, User, Shield, X } from 'lucide-react';
import { signInWithProvider, signInWithEmail, signUpWithEmail, resetPassword } from '../services/authService';

const Auth = ({ onClose, onSignIn }) => {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    setError('');
    const result = await signInWithProvider(provider);
    setLoading(false);

    if (result.success) {
      onSignIn(result.user);
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signInWithEmail(email, password);
    setLoading(false);

    if (result.success) {
      onSignIn(result.user);
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signUpWithEmail(email, password, displayName, parentEmail);
    setLoading(false);

    if (result.success) {
      setMessage('Account created! Please check your email to verify your account.');
      setMode('signin');
    } else {
      setError(result.error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await resetPassword(email);
    setLoading(false);

    if (result.success) {
      setMessage('Password reset email sent! Check your inbox.');
      setMode('signin');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl p-8 max-w-md w-full border-2 border-purple-500 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-2 text-center">
          {mode === 'signup' ? 'Create Account' : mode === 'reset' ? 'Reset Password' : 'Welcome Back'}
        </h2>
        <p className="text-purple-200 text-center mb-6">
          {mode === 'signup' ? 'Join the adventure!' : 'Sign in to save your progress'}
        </p>

        {/* Messages */}
        {error && (
          <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-900 bg-opacity-50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuthSignIn('apple')}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 border border-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-500"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-br from-gray-900 to-purple-900 text-purple-300">
              or use email
            </span>
          </div>
        </div>

        {/* Email/Password Forms */}
        {mode === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Lock size={18} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <User size={18} />
                Your Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Mail size={18} />
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Shield size={18} />
                Parent's Email
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="parent@email.com"
              />
              <p className="text-purple-300 text-xs mt-1">We'll send a verification email</p>
            </div>
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Lock size={18} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label className="text-purple-300 font-semibold mb-2 block flex items-center gap-2">
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-purple-900 bg-opacity-60 border-2 border-purple-400 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Mode Switcher */}
        <div className="mt-6 text-center text-purple-300 text-sm space-y-2">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => setMode('signup')}
                className="hover:text-white transition-colors underline"
              >
                Don't have an account? Sign up
              </button>
              <br />
              <button
                onClick={() => setMode('reset')}
                className="hover:text-white transition-colors underline"
              >
                Forgot password?
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button
              onClick={() => setMode('signin')}
              className="hover:text-white transition-colors underline"
            >
              Already have an account? Sign in
            </button>
          )}
          {mode === 'reset' && (
            <button
              onClick={() => setMode('signin')}
              className="hover:text-white transition-colors underline"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
