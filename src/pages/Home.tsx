import { useEffect, useState } from 'react';
import { TodayForm } from '../components/TodayForm';
import { CompletedState } from '../components/CompletedState';
import { useEntryStore } from '../stores/entryStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, Settings, Coins, LogOut } from 'lucide-react';

export const Home = () => {
  const { getTodayEntry, loadEntries, deleteEntry } = useEntryStore();
  const getAvailablePoints = useSettingsStore((state) => state.getAvailablePoints);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [todayEntry, setTodayEntry] = useState(getTodayEntry());
  const [isEditing, setIsEditing] = useState(false);

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
      // Delete the current entry to allow re-entry
      deleteEntry(todayEntry.id);
      setTodayEntry(undefined);
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="page-container">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-slate-800">Mobble</h1>
            <div className="flex items-center space-x-3">
              {/* Points Balance */}
              <Link
                to="/store"
                className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 border-2 border-yellow-300 rounded-lg hover:bg-yellow-200 transition-colors"
                title="Store"
              >
                <Coins className="w-5 h-5 text-yellow-700" />
                <span className="font-semibold text-yellow-800">{availablePoints}</span>
              </Link>

              <Link
                to="/history"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="History"
              >
                <Calendar className="w-5 h-5" />
              </Link>
              <Link
                to="/trends"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Trends"
              >
                <TrendingUp className="w-5 h-5" />
              </Link>
              <Link
                to="/settings"
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="page-container py-12">
        {todayEntry && !isEditing ? (
          <CompletedState entry={todayEntry} onEdit={handleEdit} />
        ) : (
          <TodayForm />
        )}
      </main>
    </div>
  );
};
