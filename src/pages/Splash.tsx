import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';

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
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6"
      style={{
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-sm md:max-w-md lg:max-w-lg w-full relative z-10">
        {/* Logo Image */}
        <div className="flex justify-center mb-2">
          <img
            src="/Mobble.png"
            alt="Mobble Logo"
            className="h-16 md:h-20 lg:h-24 w-auto object-contain"
          />
        </div>

        {/* Tagline */}
        <p
          className="text-center text-base md:text-lg mb-2"
          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: '#2C3E50' }}
        >
          Welcome to Mobble!
        </p>
        <p
          className="text-center text-xs md:text-sm mb-6 px-4"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: '#7F8C8D' }}
        >
          Gentle movement, daily.
        </p>

        {/* Mascot peeking over card - larger and overlapping */}
        <div className="flex justify-center relative z-20 md:mb-[-70px] lg:mb-[-80px]" style={{ marginBottom: '-50px' }}>
          <img
            src="/splashmockup.png"
            alt="Mobble Mascot"
            className="w-56 md:w-72 lg:w-80 h-auto object-contain"
          />
        </div>

        {/* Login Card */}
        <div
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 relative pt-[60px] md:pt-[80px] lg:pt-[90px]"
          style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
        >
          {!showLogin ? (
            /* Sign Up Form (Non-functional) */
            <>
              <form className="space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 md:py-4 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-400 text-sm md:text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  <input
                    type="password"
                    disabled
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-20 py-3 md:py-4 border border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-400 text-sm md:text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Forgot ?
                  </span>
                </div>

                {/* Log In Button (Disabled for sign-up view) */}
                <button
                  type="button"
                  disabled
                  className="w-full py-3 md:py-4 rounded-xl font-medium text-white cursor-not-allowed text-sm md:text-base"
                  style={{
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500
                  }}
                >
                  Log In
                </button>
              </form>

              {/* OR Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-3 text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google Sign In (Non-functional) */}
              <button
                type="button"
                disabled
                className="w-full py-3 md:py-4 border border-gray-200 rounded-xl font-medium text-gray-500 flex items-center justify-center gap-2 cursor-not-allowed text-sm md:text-base bg-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* No account link */}
              <p
                className="text-center text-xs text-gray-400 mt-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                No account ?
              </p>

              {/* Master Login Link */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-xs md:text-sm hover:underline transition-colors"
                  style={{ color: '#4ECDC4', fontFamily: "'Inter', sans-serif" }}
                >
                  Already have access? Log in
                </button>
              </div>
            </>
          ) : (
            /* Login Form (Functional - Firebase) */
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-3 md:py-4 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm md:text-base focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-12 pr-20 py-3 md:py-4 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm md:text-base focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-teal-500 cursor-pointer hover:underline"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Forgot ?
                  </span>
                </div>

                {loginError && (
                  <p
                    className="text-sm text-red-600 bg-red-50 p-3 rounded-xl"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {loginError}
                  </p>
                )}

                {/* Log In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 md:py-4 rounded-xl font-medium text-white text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
              </form>

              {/* OR Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-3 text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google Sign In (Non-functional) */}
              <button
                type="button"
                disabled
                className="w-full py-3 md:py-4 border border-gray-200 rounded-xl font-medium text-gray-500 flex items-center justify-center gap-2 cursor-not-allowed text-sm md:text-base bg-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Back link */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setShowLogin(false);
                    setLoginError('');
                    setEmail('');
                    setPassword('');
                  }}
                  className="text-xs md:text-sm hover:underline transition-colors"
                  style={{ color: '#4ECDC4', fontFamily: "'Inter', sans-serif" }}
                >
                  Back to sign up
                </button>
              </div>
            </>
          )}

          {/* Footer Links */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <span
              className="text-xs md:text-sm text-gray-400"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Privacy Policy · Terms of Service
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
