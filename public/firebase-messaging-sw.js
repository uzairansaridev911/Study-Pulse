importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBYkuvXq7P5R0FZSLUexhIbRYS5Ok_RqW4",
  authDomain: "studypulse-db.firebaseapp.com",
  projectId: "studypulse-db",
  storageBucket: "studypulse-db.firebasestorage.app",
  messagingSenderId: "751862030450",
  appId: "1:751862030450:web:e6075a8d3cf033827122eb"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
const db = firebase.firestore();

// Background FCM Handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Study Pulse Alert';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.image || '/logo192.png',
    sound: '/Notification.mp3' // Matched case to actual file name
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});