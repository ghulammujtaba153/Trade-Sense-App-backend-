import DeliveredNotification from "../models/deliveredNotificationSchema.js";


export const createDeliveredNotification = async (req, res) => {
  try {
    const payload = req.body;

    // If it's an array → insert many
    if (Array.isArray(payload)) {
      const docs = await DeliveredNotification.insertMany(payload);
      return res.status(201).json(docs);
    }

    // Otherwise insert single item
    const newDeliveredNotification = await DeliveredNotification.create(payload);
    res.status(201).json(newDeliveredNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getDeliveredNotifications = async (req, res) => {
    const {isDelivered} = req.query;
    const {id} = req.params;

    try {
        if(isDelivered) {
            const deliveredNotifications = await DeliveredNotification.find({ receiverId: id, isDelivered: isDelivered }).populate('notificationId');
            res.status(200).json(deliveredNotifications);
        } else {
            const deliveredNotifications = await DeliveredNotification.find({receiverId: id}).populate('notificationId');
            res.status(200).json(deliveredNotifications);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}