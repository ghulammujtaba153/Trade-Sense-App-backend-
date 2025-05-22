import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const ONESIGNAL_API_URL = 'https://onesignal.com/api/v1/notifications';

export const sendPushNotification = async ({ headings, contents, userIds }) => {
  try {
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new Error("No user IDs provided for push notification.");
    }

    const response = await axios.post(
      ONESIGNAL_API_URL,
      {
        app_id: process.env.ONESIGNAL_APP_ID,
        include_external_user_ids: userIds.map(id => id.toString()),
        headings: { en: headings },
        contents: { en: contents },
      },
      {
        headers: {
          Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Push notification sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending push notification:', error?.response?.data || error.message);
    throw error;
  }
};
