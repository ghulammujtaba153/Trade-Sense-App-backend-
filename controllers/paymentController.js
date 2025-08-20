import Payment from "../models/paymentSchema.js";

export const createPayment = async (req, res) => {
    console.log(req.body);
    
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json({
            success: true,
            payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({userId: req.params.id}).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            payments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export const getWithdrawalRequests = async (req, res) => {
    try {
        const withdrawalRequests = await Payment.find({}).sort({createdAt: -1}).populate("userId");
        res.status(200).json({
            success: true,
            withdrawalRequests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (req.body.status === 'completed') {
            const user = await Account.findOne({ userId: payment.userId });
            if (user) {
                user.balance -= payment.amount;
                await user.save();
            }
        }
        res.status(200).json({
            success: true,
            payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}