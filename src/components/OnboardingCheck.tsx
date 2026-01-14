import { Navigate, useLocation } from 'react-router-dom';
import { useSettingsStore } from '../stores/settingsStore';
import { Walkthrough } from './Walkthrough';

interface OnboardingCheckProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that redirects new users to profile setup
 * and shows walkthrough for first-time users after profile setup
 */
export const OnboardingCheck = ({ children }: OnboardingCheckProps) => {
  const { isProfileComplete, hasCompletedWalkthrough, completeWalkthrough } = useSettingsStore();
  const location = useLocation();

  // Don't redirect if already on setup page
  if (location.pathname === '/setup') {
    return <>{children}</>;
  }

  // If profile is not complete, redirect to setup
  if (!isProfileComplete()) {
    return <Navigate to="/setup" replace />;
  }

  // If profile is complete but walkthrough not done, show walkthrough overlay
  if (!hasCompletedWalkthrough()) {
    return (
      <>
        {children}
        <Walkthrough onComplete={completeWalkthrough} />
      </>
    );
  }

  return <>{children}</>;
};
