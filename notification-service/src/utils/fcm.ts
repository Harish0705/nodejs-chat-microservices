import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("../../fcm.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export class FCMService {
  async sendPushNotification(token: string, message: string) {
      const payload = {
          notification: {
              title: "New Message",
              body: message,
          },
          token: token,
      };

      try {
          const message = await admin.messaging().send(payload);
          console.log(`Notification sent successfully: ${message}`);
      } catch (error) {
          console.error("Error sending notification", error);
      }
  }
}