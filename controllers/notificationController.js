import Notification from "../models/notificationSchema.js";
import User from "../models/userSchema.js";




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


    const notificationData = {
      title: title.trim(),
      message: message.trim(),
      targetType,
      sendType,
      status: scheduleTime ? "scheduled" : "sent",
    };

    if (targetRoles){
      notificationData.targetRoles = targetRoles;
    }

    if (recipients){
      notificationData.recipients = recipients;
    }

    if(sendAt){
      notificationData.sendAt = sendAt;
    }


    if (scheduleTime) {
      const scheduleDate = new Date(scheduleTime);
      if (isNaN(scheduleDate.getTime())) {
        return res.status(400).json({ message: "Invalid scheduleTime format." });
      }
      notificationData.sendAt = scheduleDate;
    }

    const newNotification = new Notification(notificationData);
    await newNotification.save();

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

