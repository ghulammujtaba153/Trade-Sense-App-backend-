import DailyQuote from "../models/dailyQuoteSchema.js"


export const createDailyQuote = async (req, res) => {
    try {
        const dailQuote = await DailyQuote.create(req.body);
        res.status(200).json(dailQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllDailyQuotes = async (req, res) => {
    try {
        const dailyQuotes = await DailyQuote.find({});
        console.log(dailyQuotes);
        res.status(200).json(dailyQuotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getDailyQuote = async (req, res) => {
    try {

        // Find latest quote for today using createdAt
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let dailyQuote = await DailyQuote.findOne({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ createdAt: -1 });
        if (!dailyQuote) {
            // No quote for today, get all except the latest
            const allQuotes = await DailyQuote.find({}).sort({ createdAt: -1 });
            if (allQuotes.length > 1) {
                // Exclude the latest
                const quotesExcludingLatest = allQuotes.slice(1);
                // Pick a random one
                const randomIndex = Math.floor(Math.random() * quotesExcludingLatest.length);
                dailyQuote = quotesExcludingLatest[randomIndex];
            } else if (allQuotes.length === 1) {
                // Only one quote exists, return it
                dailyQuote = allQuotes[0];
            } else {
                dailyQuote = null;
            }
        }

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