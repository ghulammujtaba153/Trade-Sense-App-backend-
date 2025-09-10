import mongoose from "mongoose";

const dailyQuoteSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const DailyQuote = mongoose.model('DailyQuote', dailyQuoteSchema);

export default DailyQuote



