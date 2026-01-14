import { useState } from 'react';
import { Bell, BellOff, Clock } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import {
  isPushSupported,
  getNotificationPermission,
  setupPushNotifications,
} from '../utils/fcmClient';

export const ReminderSettings = () => {
  const { settings, enableReminders, disableReminders, setReminderTime } = useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = isPushSupported();
  const permission = getNotificationPermission();
  const { reminders } = settings;

  const handleToggleReminders = async () => {
    if (reminders.enabled) {
      disableReminders();
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await setupPushNotifications();

    if (result.success && result.token) {
      enableReminders(result.token);
    } else {
      setError(result.error || 'Failed to enable notifications');
    }

    setIsLoading(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminderTime(e.target.value);
  };

  const getStatusMessage = (): string => {
    if (!isSupported) {
      return 'Push notifications are not supported in this browser';
    }
    if (permission === 'denied') {
      return 'Notifications are blocked. Please enable them in your browser settings.';
    }
    if (reminders.enabled) {
      return `You'll receive a reminder at ${formatTime(reminders.time)}`;
    }
    return 'Get a daily reminder to log your movement';
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {reminders.enabled ? (
            <Bell className="w-5 h-5 text-slate-700" />
          ) : (
            <BellOff className="w-5 h-5 text-slate-400" />
          )}
          <div>
            <h3 className="font-semibold text-slate-800">Daily Reminders</h3>
            <p className="text-sm text-slate-500">{getStatusMessage()}</p>
          </div>
        </div>

        <button
          onClick={handleToggleReminders}
          disabled={isLoading || !isSupported || permission === 'denied'}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            reminders.enabled ? 'bg-slate-800' : 'bg-slate-300'
          } ${(isLoading || !isSupported || permission === 'denied') ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              reminders.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {reminders.enabled && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <label className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">Remind me at</span>
            <input
              type="time"
              value={reminders.time}
              onChange={handleTimeChange}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </label>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!isSupported && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            To receive reminders, try opening this app in Chrome or Firefox, or install it as a PWA on your phone.
          </p>
        </div>
      )}
    </div>
  );
};
