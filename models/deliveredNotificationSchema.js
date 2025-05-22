import mongoose from "mongoose";

const deliveredNotificationSchema = mongoose.Schema({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
        required: true
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

const DeliveredNotification = mongoose.model("DeliveredNotification", deliveredNotificationSchema);

export default DeliveredNotification;