import { getToken, onMessage, type MessagePayload } from 'firebase/messaging';
import { getFirebaseMessaging } from '../lib/firebase';

// VAPID key - you'll need to generate this in Firebase Console
// Go to: Project Settings > Cloud Messaging > Web Push certificates
const VAPID_KEY = 'YOUR_VAPID_KEY_HERE'; // TODO: Replace with actual VAPID key

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

/**
 * Check if push notifications are supported in this browser
 */
export const isPushSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Get current notification permission status
 */
export const getNotificationPermission = (): NotificationPermissionStatus => {
  if (!isPushSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
};

/**
 * Request notification permission from the user
 */
export const requestNotificationPermission = async (): Promise<NotificationPermissionStatus> => {
  if (!isPushSupported()) {
    console.log('[fcmClient] Push notifications not supported');
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('[fcmClient] Permission result:', permission);
    return permission;
  } catch (error) {
    console.error('[fcmClient] Error requesting permission:', error);
    return 'denied';
  }
};

/**
 * Register service worker for push notifications
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('[fcmClient] Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('[fcmClient] Service worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('[fcmClient] Service worker registration failed:', error);
    return null;
  }
};

/**
 * Get FCM token for this device
 * This token is used to send push notifications to this specific device
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      console.log('[fcmClient] Messaging not supported');
      return null;
    }

    // Make sure we have permission
    const permission = getNotificationPermission();
    if (permission !== 'granted') {
      console.log('[fcmClient] Notification permission not granted');
      return null;
    }

    // Register service worker first
    const registration = await registerServiceWorker();
    if (!registration) {
      return null;
    }

    // Get the token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log('[fcmClient] FCM Token:', token);
    return token;
  } catch (error) {
    console.error('[fcmClient] Error getting FCM token:', error);
    return null;
  }
};

/**
 * Listen for foreground messages (when app is open)
 */
export const onForegroundMessage = (
  callback: (payload: MessagePayload) => void
): (() => void) | null => {
  let unsubscribe: (() => void) | null = null;

  getFirebaseMessaging().then((messaging) => {
    if (messaging) {
      unsubscribe = onMessage(messaging, (payload) => {
        console.log('[fcmClient] Foreground message received:', payload);
        callback(payload);
      });
    }
  });

  // Return cleanup function
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

/**
 * Full setup flow for push notifications
 * 1. Check support
 * 2. Request permission
 * 3. Register service worker
 * 4. Get FCM token
 */
export const setupPushNotifications = async (): Promise<{
  success: boolean;
  token: string | null;
  error?: string;
}> => {
  // Check support
  if (!isPushSupported()) {
    return { success: false, token: null, error: 'Push notifications not supported in this browser' };
  }

  // Request permission
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    return { success: false, token: null, error: 'Notification permission denied' };
  }

  // Get token
  const token = await getFCMToken();
  if (!token) {
    return { success: false, token: null, error: 'Failed to get FCM token' };
  }

  return { success: true, token };
};

/**
 * TODO: Implement server-side token storage
 * When you have a backend, call this to save the token for the user
 */
export const saveTokenToServer = async (userId: string, token: string): Promise<void> => {
  // TODO: Implement Firestore or API call to save token
  console.log('[fcmClient] TODO: Save token to server', { userId, token: token.substring(0, 20) + '...' });
};
