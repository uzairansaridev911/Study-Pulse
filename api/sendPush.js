import admin from 'firebase-admin';

// Initialize Firebase Admin with the Service Account from Vercel Environment Variables
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { targetUserId, title, body, data } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ error: 'Missing targetUserId' });
    }

    // 1. Fetch the target user's document to get their fcmToken
    const userDoc = await admin.firestore().collection('users').doc(targetUserId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    const userData = userDoc.data();
    const fcmToken = userData.fcmToken;

    if (!fcmToken) {
      return res.status(400).json({ error: 'User does not have an FCM token registered' });
    }

    // 2. Construct the push notification payload
    const payload = {
      token: fcmToken,
      notification: {
        title: title || 'Study Pulse Alert',
        body: body || 'You have a new notification',
      },
      data: data || {}
    };

    // 3. Send the notification
    const response = await admin.messaging().send(payload);
    console.log(`Successfully sent push notification to ${targetUserId}:`, response);
    
    return res.status(200).json({ success: true, messageId: response });

  } catch (error) {
    console.error('Error sending push notification:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
