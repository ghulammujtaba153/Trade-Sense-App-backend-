import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   balance: {
        type: Number,
        default: 0,
    },
    enrollmentProfit: {
        type: Number,
        default: 0,
    },
    visitProfit: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
   