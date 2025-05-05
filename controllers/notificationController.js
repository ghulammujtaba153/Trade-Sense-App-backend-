import Notification from "../models/notificationSchema.js";

export const createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      targetAudience,
      scheduleTime, // optional: for scheduled notifications
      type, // optional: 'info', 'alert', etc.
    } = req.body;

    if (!title || !message || !targetAudience) {
      return res
        .status(400)
        .json({ message: "Title, message, and targetAudience are required." });
    }

    const newNotification = new Notification({
      title,
      message,
      targetAudience,
      scheduleTime,
      type,
      status: scheduleTime ? "scheduled" : "sent",
    });

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

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res
      .status(200)
      .json({
        message: "Notification updated",
        notification: updatedNotification,
      });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Internal server error" });
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
