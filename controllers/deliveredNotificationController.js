import DeliveredNotification from "../models/deliveredNotificationSchema.js";


export const createDeliveredNotification = async (req, res) => {
    const { receiverId, notificationId } = req.body;
    try {
        const newDeliveredNotification = await DeliveredNotification.create({ receiverId, notificationId });
        res.status(201).json(newDeliveredNotification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


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