import mongoose from "mongoose";

const dailyQuoteSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
})

const DailyQuote = mongoose.model('DailyQuote', dailyQuoteSchema);

export default DailyQuote



