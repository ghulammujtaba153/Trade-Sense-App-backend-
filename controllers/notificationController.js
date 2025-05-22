import DeliveredNotification from "../models/deliveredNotificationSchema.js";
import Notification from "../models/notificationSchema.js";
import User from "../models/userSchema.js";
import { sendPushNotification } from "../utils/sendPushNotification.js";


export const createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      targetType,
      scheduleTime,
      sendType,
      targetRoles,
      recipients,
      sendAt
    } = req.body;

    console.log("notification data", req.body);

    
    const notificationData = {
      title: title.trim(),
      message: message.trim(),
      targetType,
      sendType,
      status: scheduleTime ? "scheduled" : "sent",
    };

    
    if (targetType === 'roles' && Array.isArray(targetRoles)) {
      notificationData.targetRoles = targetRoles;

      
      const users = await User.find({
        role: { $in: targetRoles },
        isDeleted: false,
        status: 'active',
      }).select('_id');

      console.log("users", users);

      notificationData.recipients = users.map(user => user._id);
    } 


    if(targetType === 'specific') {
      notificationData.recipients = recipients;
    }


    if (sendAt) {
      notificationData.sendAt = new Date(sendAt);
    }

    // Only send push notification immediately if it's not scheduled
      if (!scheduleTime && notificationData.recipients.length > 0) {
        await sendPushNotification({
          headings: title,
          contents: message,
          userIds: notificationData.recipients
        });
      }

   
    if (scheduleTime) {
      const scheduleDate = new Date(scheduleTime);
      if (isNaN(scheduleDate.getTime())) {
        return res.status(400).json({ message: "Invalid scheduleTime format." });
      }
      notificationData.sendAt = scheduleDate;
    }

    
    const newNotification = await Notification.create(notificationData);

    console.log("newNotification", newNotification);

    
    if (newNotification.recipients?.length) {
      const deliveredNotifications = newNotification.recipients.map(userId => ({
        receiverId: userId,
        notificationId: newNotification._id,
      }));

      await DeliveredNotification.insertMany(deliveredNotifications);
    }

    res.status(201).json({
      message: "Notification created successfully.",
      notification: newNotification,
    });

  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};




export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.title) updates.title = updates.title.trim();
    if (updates.message) updates.message = updates.message.trim();

    if (updates.scheduleTime) {
      const scheduleDate = new Date(updates.scheduleTime);
      if (isNaN(scheduleDate.getTime())) {
        return res.status(400).json({ message: "Invalid scheduleTime format." });
      }
      updates.scheduleTime = scheduleDate;
      updates.status = "scheduled";
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({
      message: "Notification updated successfully.",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const sendScheduledNotifications = async () => {
  try {
    const now = new Date();

    // Find all unsent and due notifications
    const scheduledNotifications = await Notification.find({
      scheduledAt: { $lte: now },
      sent: false,
    });

    for (const notification of scheduledNotifications) {
      // Simulate sending (e.g., push service or email logic goes here)
      console.log(
        `Sending notification to ${notification.targetAudience}: ${notification.title}`
      );

      // Mark as sent
      notification.sent = true;
      await notification.save();
    }

    console.log(
      `${scheduledNotifications.length} scheduled notifications sent.`
    );
  } catch (error) {
    console.error("Error sending scheduled notifications:", error);
  }
};

export const markNotificationAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.seen = true;
    await notification.save();

    res
      .status(200)
      .json({ message: "Notification marked as seen", notification });
  } catch (error) {
    console.error("Error marking notification as seen:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotificationHistory = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }); // most recent first

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notification history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

   
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const now = new Date();

    
    const notifications = await Notification.find({
      sendAt: { $gte: user.createdAt, $lte: now }, 
      $or: [
        { sendType: "now" },
        { sendType: "scheduled", sendAt: { $lte: now } }, 
      ],
      $or: [
        { targetType: "all" },
        { targetType: "specific", recipients: user._id },
        { targetType: "roles", targetRoles: user.role },
      ],
    }).sort({ sendAt: -1 });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications for user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

