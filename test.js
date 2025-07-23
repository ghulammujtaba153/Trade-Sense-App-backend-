import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Create service account object from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send notification
export default function sendNotificationToUser(title, message, token) {
  const notificationMessage = {
    notification: {
      title,
      body: message,
    },
    token,
  };

  return admin.messaging().send(notificationMessage)
    .then(response => {
      console.log("Successfully sent message:", response);
      return { success: true, response };
    })
    .catch(error => {
      console.log("Error sending message:", error);
      return { success: false, error };
    });
}

// Example call (uncomment to test)
// sendNotificationToUser("test title", "test message", "FCM_TOKEN_HERE");
