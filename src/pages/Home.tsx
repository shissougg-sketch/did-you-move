import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coins, LogOut, Crown, Check } from 'lucide-react';
import { TodayForm } from '../components/TodayForm';
import { CompletedState } from '../components/CompletedState';
import { PageLayout } from '../components/PageLayout';
import { MobbleJourney } from '../components/MobbleJourney';
import { MobbleEmote } from '../components/MobbleEmote';
import { Modal } from '../components/ui';
import { useEntryStore } from '../stores/entryStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useStoryStore } from '../stores/storyStore';
import { useAuth } from '../contexts/AuthContext';

export const Home = () => {
  const { getTodayEntry, loadEntries, deleteEntry } = useEntryStore();
  const getAvailablePoints = useSettingsStore((state) => state.getAvailablePoints);
  const hasStartedJourney = useStoryStore((state) => state.hasStartedJourney);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [todayEntry, setTodayEntry] = useState(getTodayEntry());
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const availablePoints = getAvailablePoints();

  const handleLogout = async () => {
    await signOut();
    navigate('/splash');
  };

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    setTodayEntry(getTodayEntry());
  }, [getTodayEntry]);

  const handleEdit = () => {
    if (todayEntry) {
      deleteEntry(todayEntry.id);
      setTodayEntry(undefined);
      setIsEditing(false);
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <header className="pt-6 pb-2 px-5">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Brand */}
          <img
            src="/Mobble.png"
            alt="Go Mobble"
            className="h-10 w-auto object-contain"
          />

          <div className="flex items-center gap-2">
            {/* Pro Subscribe Button */}
            <button
              onClick={() => setShowSubscribeModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
              }}
            >
              <Crown className="w-4 h-4 text-white" />
              <span className="font-semibold text-sm text-white">Pro</span>
            </button>

            {/* Points Badge */}
            <Link
              to="/store"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 210, 74, 0.15)',
                border: '1px solid rgba(255, 210, 74, 0.3)',
              }}
            >
              <Coins className="w-4 h-4 text-mobble-accent" />
              <span
                className="font-semibold text-sm"
                style={{ color: 'var(--color-text-heading)' }}
              >
                {availablePoints}
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-container pt-6 pb-8">
        {todayEntry && !isEditing ? (
          <CompletedState entry={todayEntry} onEdit={handleEdit} />
        ) : (
          <TodayForm />
        )}

        {/* Story Progress Card - compact, only shows if journey started */}
        {hasStartedJourney() && (
          <Link
            to="/story"
            className="block mt-6 hover:scale-[1.01] transition-transform"
          >
            <MobbleJourney compact />
          </Link>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        ariaLabel="Logout confirmation"
      >
        <div className="text-center -mt-2">
          <MobbleEmote
            emote="coy"
            animation="breathing"
            size="xl"
            alt="Mobble saying goodbye"
          />

          <h3
            className="text-xl font-semibold mt-4"
            style={{ color: 'var(--color-text-heading)' }}
          >
            Sure you want to log out?
          </h3>

          <p className="text-slate-500 text-sm mt-2">
            You can always come back later.
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-all"
            >
              Log out
            </button>
          </div>
        </div>
      </Modal>

      {/* Subscription Modal */}
      <Modal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        ariaLabel="Subscribe to Go Mobble Pro"
      >
        <div className="text-center -mt-2">
          {/* Pro Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            }}
          >
            <Crown className="w-5 h-5 text-white" />
            <span className="font-bold text-white">Go Mobble Pro</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span
              className="text-4xl font-bold font-display"
              style={{ color: 'var(--color-text-heading)' }}
            >
              $4.99
            </span>
            <span className="text-slate-500 text-lg">/mo</span>
          </div>

          {/* Benefits List */}
          <div className="text-left space-y-3 mb-6">
            {[
              'Exclusive premium cosmetics',
              'Ad-free experience',
              'Priority support',
              'Early access to new features',
              'Support app development',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
                >
                  <Check className="w-3 h-3 text-purple-600" />
                </div>
                <span className="text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          <button
            className="w-full py-4 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
            }}
            onClick={() => {
              // TODO: Implement subscription
              alert('Subscription coming soon!');
            }}
          >
            Subscribe Now
          </button>

          {/* Cancel Note */}
          <p className="text-slate-400 text-sm mt-4">
            Cancel anytime. No commitments.
          </p>
        </div>
      </Modal>
    </PageLayout>
  );
};
