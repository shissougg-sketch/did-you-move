import { useState } from 'react';
import { Heart, RefreshCw, Smartphone } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import {
  isIOS,
  isHealthKitAvailable,
  requestHealthKitPermission,
  syncHealthData,
} from '../utils/healthkitClient';
import type { SyncFrequency } from '../types/settings';

export const HealthKitSettings = () => {
  const { settings, connectHealthKit, disconnectHealthKit, setSyncFrequency, updateLastSync } =
    useSettingsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { healthkit } = settings;
  const available = isHealthKitAvailable();
  const onIOS = isIOS();

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);

    const result = await requestHealthKitPermission();

    if (result.success) {
      connectHealthKit();
      // Trigger initial sync
      const syncResult = await syncHealthData(7);
      if (syncResult.success) {
        updateLastSync();
      }
    } else {
      setError(result.error || 'Failed to connect to Health');
    }

    setIsLoading(false);
  };

  const handleDisconnect = () => {
    disconnectHealthKit();
  };

  const handleSync = async () => {
    setIsLoading(true);
    setError(null);

    const result = await syncHealthData(7);

    if (result.success) {
      updateLastSync();
    } else {
      setError(result.error || 'Sync failed');
    }

    setIsLoading(false);
  };

  const handleFrequencyChange = (frequency: SyncFrequency) => {
    setSyncFrequency(frequency);
  };

  const formatLastSync = (): string => {
    if (!healthkit.lastSyncAt) return 'Never';
    const date = new Date(healthkit.lastSyncAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const frequencyOptions: { value: SyncFrequency; label: string }[] = [
    { value: 'on-open', label: 'When app opens' },
    { value: 'daily', label: 'Once daily' },
    { value: 'every-other-day', label: 'Every other day' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Heart className={`w-5 h-5 ${healthkit.connected ? 'text-red-500' : 'text-slate-400'}`} />
          <div>
            <h3 className="font-semibold text-slate-800">Health App</h3>
            <p className="text-sm text-slate-500">
              {healthkit.connected
                ? 'Syncing steps, calories & workouts'
                : 'Connect to sync your health data'}
            </p>
          </div>
        </div>

        {available && (
          <button
            onClick={healthkit.connected ? handleDisconnect : handleConnect}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              healthkit.connected ? 'bg-red-500' : 'bg-slate-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                healthkit.connected ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        )}
      </div>

      {/* Not available message */}
      {!available && (
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm text-slate-600">
                {onIOS
                  ? 'Health integration will be available in a future update when the app is installed natively.'
                  : 'Health app integration is only available on iOS devices.'}
              </p>
              {onIOS && (
                <p className="text-xs text-slate-500 mt-1">
                  We're working on native iOS support with Apple Health integration.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Connected state with options */}
      {healthkit.connected && (
        <div className="mt-4 space-y-4">
          {/* Sync frequency */}
          <div className="pt-4 border-t border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Sync frequency</label>
            <div className="flex flex-wrap gap-2">
              {frequencyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFrequencyChange(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-colors ${
                    healthkit.syncFrequency === option.value
                      ? 'border-slate-800 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Last sync and manual sync */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div>
              <p className="text-sm text-slate-600">Last synced</p>
              <p className="text-sm font-medium text-slate-800">{formatLastSync()}</p>
            </div>
            <button
              onClick={handleSync}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm">Sync now</span>
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
