import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the service account JSON file
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, './firebase-account.json'), 'utf8')
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default function sendNotificationToUser(title, message, token) {
  const notificationMessage = {
    notification: {
      title: title,
      body: message,
    },
    token: token,
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

// Call the function
// sendNotificationToUser("test title", "test message", "eP9TydgUT_6KwPwOedZwG4:APA91bEohSTADBiEEm5Aaemue2ZI32i8rlCPThQXgt96SggzIekJJ4ATY5ScYt5qrNMkMfQ4HyKvme6DcK1azoJgVNIwW6RIx1iVBoP85Fe7lwWh-8KP8Qo");
