import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OnboardingCheck } from './components/OnboardingCheck';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { Store } from './pages/Store';
import { Story } from './pages/Story';
import { Splash } from './pages/Splash';
import { ProfileSetup } from './components/ProfileSetup';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route - Splash/Landing page */}
          <Route path="/splash" element={<Splash />} />

          {/* Profile setup route - protected but no onboarding check */}
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />

          {/* Protected routes with onboarding check */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <Home />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <History />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <Insights />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <Settings />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <Store />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />
          <Route
            path="/story"
            element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <Story />
                </OnboardingCheck>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/splash" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
