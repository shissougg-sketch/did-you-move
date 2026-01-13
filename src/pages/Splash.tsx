import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Splash = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/Mascot.png"
              alt="Mobble Mascot"
              className="w-32 h-32 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Mobble</h1>
          <p className="text-slate-600">
            A minimal fitness awareness app - no shame, no streaks, just honest self-awareness.
          </p>
        </div>

        {!showLogin ? (
          /* Sign Up Form (Non-functional) */
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Join the Waitlist
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Sign-ups are coming soon! Enter your email to join the waitlist.
            </p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  disabled
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed text-slate-500"
                />
              </div>

              <button
                type="button"
                disabled
                className="w-full py-3 px-6 bg-slate-300 text-slate-500 rounded-lg font-medium cursor-not-allowed"
              >
                Sign Up (Coming Soon)
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowLogin(true)}
                className="text-sm text-slate-600 hover:text-slate-800 underline transition-colors"
              >
                Already have access? Log in
              </button>
            </div>
          </div>
        ) : (
          /* Login Form (Functional - Firebase) */
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              Log In
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-colors"
                />
              </div>

              {loginError && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowLogin(false);
                  setLoginError('');
                  setEmail('');
                  setPassword('');
                }}
                className="text-sm text-slate-600 hover:text-slate-800 underline transition-colors"
              >
                Back to waitlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
