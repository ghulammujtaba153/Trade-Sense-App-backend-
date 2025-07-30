// cronJobs/scheduler.js
import cron from 'node-cron';

import User from '../models/userSchema.js';
import sendNotificationToUser from "../test.js";
import notificationSchema from '../models/notificationSchema.js';

cron.schedule('* * * * *', async () => {
  console.log("Checking for scheduled notifications...");

  const now = new Date();
  const notifications = await notificationSchema.find({
    status: "scheduled",
    scheduleTime: { $lte: now }
  });

  for (const notification of notifications) {
    const users = await User.find({
      _id: { $in: notification.recipients },
      isDeleted: false,
      status: 'active'
    }).select('fcmToken');

    const tokens = users
      .filter(u => u.fcmToken?.trim())
      .map(u => u.fcmToken);

    for (const token of tokens) {
      try {
        await sendNotificationToUser(notification.title, notification.message, token);
      } catch (err) {
        console.log("Scheduled send error:", err.message);
      }
    }

    notification.status = "sent";
    await notification.save();
  }
});
