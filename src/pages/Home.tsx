import { useEffect, useState } from 'react';
import { TodayForm } from '../components/TodayForm';
import { CompletedState } from '../components/CompletedState';
import { useEntryStore } from '../stores/entryStore';
import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Settings } from 'lucide-react';

export const Home = () => {
  const { getTodayEntry, loadEntries, deleteEntry } = useEntryStore();
  const [todayEntry, setTodayEntry] = useState(getTodayEntry());
  const [isEditing, setIsEditing] = useState(false);

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
            <h1 className="text-2xl font-bold text-slate-800">Did You Move?</h1>
            <div className="flex items-center space-x-4">
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
