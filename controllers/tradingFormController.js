import TradingForm from "../models/tradingFormSchema.js";


export const createTradingForm = async (req, res) => {
    try {
        const tradingForm = await TradingForm.create(req.body);
        res.status(201).json(tradingForm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const getTradingForm = async (req, res) => {
    const {id} = req.params;
    try {
        const tradingForm = await TradingForm.find({userId: id});
        res.status(200).json(tradingForm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}