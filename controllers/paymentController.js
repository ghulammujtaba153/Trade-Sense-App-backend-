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
        const payments = await Payment.find();
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


export const updateStatus = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
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