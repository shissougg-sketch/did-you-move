// Firebase Cloud Messaging Service Worker
// This handles background push notifications when the app is closed

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDGZJsiHV7LVSygyDUE0xBcnjWjLfZXzsI",
  authDomain: "mobble-5c274.firebaseapp.com",
  projectId: "mobble-5c274",
  storageBucket: "mobble-5c274.firebasestorage.app",
  messagingSenderId: "548780301916",
  appId: "1:548780301916:web:de98a3bd1017e79556d099",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Mobble Reminder';
  const notificationOptions = {
    body: payload.notification?.body || 'Time to log your movement for today!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'mobble-reminder',
    data: payload.data,
    actions: [
      { action: 'log', title: 'Log Now' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event.action);

  event.notification.close();

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
