/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

// Initialize the Firebase Admin SDK
admin.initializeApp();

/**
 * Cloud Function to send FCM push notification when a new notification
 * document is created in Firestore.
 */
exports.sendPushNotification = onDocumentCreated("notifications/{notificationId}", async (event) => {
  const snapshot = event.data;
  
  // If no data is present (shouldn't happen on create), exit.
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const notificationData = snapshot.data();
  const targetUserId = notificationData.userId;

  if (!targetUserId) {
    console.log("No userId found in notification document");
    return;
  }

  try {
    // 1. Fetch the target user's document to get their fcmToken
    const userDoc = await admin.firestore().collection("users").doc(targetUserId).get();
    
    if (!userDoc.exists) {
      console.log(`User ${targetUserId} does not exist`);
      return;
    }

    const userData = userDoc.data();
    const fcmToken = userData.fcmToken;

    if (!fcmToken) {
      console.log(`User ${targetUserId} does not have an FCM token. Cannot send push notification.`);
      return;
    }

    // 2. Construct the push notification payload
    const payload = {
      token: fcmToken,
      notification: {
        title: notificationData.title || "Study Pulse Alert",
        body: notificationData.body || "You have a new notification",
        // 'image' field can be used on Android. For standard icons, rely on frontend SW logic or add imageUrl
      },
      data: {
        // You can pass custom data here that your frontend SW can read
        type: notificationData.type || "general",
        fromUserId: notificationData.from || "",
        notificationId: event.params.notificationId
      }
    };

    // 3. Send the notification via Firebase Cloud Messaging
    const response = await admin.messaging().send(payload);
    console.log(`Successfully sent push notification to ${targetUserId}:`, response);

  } catch (error) {
    console.error("Error sending push notification:", error);
  }
});
