import DailyQuote from "../models/dailyQuoteSchema.js"


export const createDailyQuote = async (req, res) => {
    try {
        const dailQuote = await DailyQuote.create(req.body);
        res.status(200).json(dailQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const getDailyQuotes = async (req, res) => {
    try {
        const dailyQuote= await DailyQuote.find({});
        res.status(200).json(dailyQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getDailyQuoteById = async (req, res) => {
    try {
        const dailyQuote = await DailyQuote.findById(req.params.id);
        res.status(200).json(dailyQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const updateDailyQuote = async (req, res) => {
    try {
        const dailyQuote = await DailyQuote.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(dailyQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const deleteQuote = async (req, res) => {
    try {
        const dailyQuote = await DailyQuote.findByIdAndDelete(req.params.id);
        res.status(200).json(dailyQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}