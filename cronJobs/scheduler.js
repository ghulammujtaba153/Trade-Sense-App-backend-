// cronJobs/scheduler.js
import cron from 'node-cron';

import User from '../models/userSchema.js';
import sendNotificationToUser from "../test.js";
import notificationSchema from '../models/notificationSchema.js';
import Livestream from '../models/livestreamSchema.js';

cron.schedule('* * * * *', async () => {

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

// Livestream notification scheduler (runs every minute)
// Supports notificationOptions: '2 hours before','1 hour before','30 minutes before','10 minutes before','At start time'
// Each livestream document has: startDateTime, sendNotification: [string labels], and new field sentNotifications: [{label, sentAt}]
// For backward compatibility if some entries in sendNotification are objects (from previous implementation),
// we treat them as already-sent and also push them into sentNotifications if missing.
cron.schedule('* * * * *', async () => {
  const now = new Date();
  try {
    // Fetch livestreams that are not finished and start within next 2 hours (largest offset)
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const streams = await Livestream.find({
      endDateTime: { $gte: now },
      startDateTime: { $lte: twoHoursLater }
    }).populate('user');

    if (!streams.length) return;

    const optionToMs = {
      '2 hours before': 2 * 60 * 60 * 1000,
      '1 hour before': 60 * 60 * 1000,
      '30 minutes before': 30 * 60 * 1000,
      '10 minutes before': 10 * 60 * 1000,
      'At start time': 0
    };

    for (const stream of streams) {
      if (!Array.isArray(stream.sendNotification) || !stream.sendNotification.length) continue;
      const start = new Date(stream.startDateTime).getTime();

      // Build a Set of already sent labels (from sentNotifications)
      const sentSet = new Set((stream.sentNotifications || []).map(s => s.label));

      // Backward compatibility: if sendNotification contains objects with sentAt, fold them into sentNotifications
      let migrateNeeded = false;
      stream.sendNotification.forEach(entry => {
        if (entry && typeof entry === 'object' && entry.label && entry.sentAt && !sentSet.has(entry.label)) {
          stream.sentNotifications.push({ label: entry.label, sentAt: entry.sentAt });
          sentSet.add(entry.label);
          migrateNeeded = true;
        }
      });

      let updated = migrateNeeded;

      for (const rawEntry of stream.sendNotification) {
        const label = typeof rawEntry === 'string' ? rawEntry : rawEntry?.label;
        if (!label || !optionToMs.hasOwnProperty(label) || sentSet.has(label)) continue;
        const targetTime = start - optionToMs[label];
        if (targetTime <= now.getTime() && now.getTime() < targetTime + 60 * 1000) {
          const title = `Livestream: ${stream.title}`;
          const whenText = label === 'At start time' ? 'is starting now' : `starts ${label.replace('before','from now')}`;
          const message = `${stream.description || 'A livestream you follow'} ${whenText}.`;

          const users = await User.find({ isDeleted: false, status: 'active' }).select('fcmToken');
          const tokens = users.filter(u => u.fcmToken?.trim()).map(u => u.fcmToken);
          for (const token of tokens) {
            try { await sendNotificationToUser(title, message, token); } catch (err) { console.log('Livestream send error:', err.message); }
          }
          stream.sentNotifications.push({ label, sentAt: new Date() });
          sentSet.add(label);
          updated = true;
        }
      }

      if (updated) {
        try { await stream.save(); } catch (err) { console.log('Livestream save error:', err.message); }
      }
    }
  } catch (err) {
    console.log('Livestream scheduler error:', err.message);
  }
});
