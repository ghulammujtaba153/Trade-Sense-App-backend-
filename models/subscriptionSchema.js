import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    appUserId: {
        type: String,
        required: true
    }, 
    productIdentifier: {
        type: String,
        
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    environment: { type: String, enum: ['sandbox', 'production'], default: 'sandbox' },
    status: { type: String, enum: ['active', 'expired', 'unknown'] },
    lastUpdated: { type: Date, default: Date.now }
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);


export default Subscription
