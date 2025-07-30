import mongoose from "mongoose"


const tradingFormSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    stockName:{
        type: String
    },
    tradeDate: {
        type: Date,
        default: Date.now
    },
    tradeType:{
        type: String,
        required: true
    },
    setupName :{ 
        type: String,
        required: true
    },
    direction :{
        type: String,
        required: true
    }, 
    entryPrice : {
        type: Number,
        required: true
    }, 
    exitPrice: {
        type: Number,
        required: true
    }, 
    quantity: {
        type: Number,
        required: false,
        default: 0
    }, 
    stopLoss : {
        type: Number,
        required: true
    }, 
    takeProfitTarget : {
        type: Number,
        required: true
    }, 
    actualExitPrice : {
        type: Number,
        required: true
    }, 
    result : {
        type: String,
        required: true
    }, 
    emotionalState : {
        type: String,
        required: true
    },
    
    notes:{
        type: String
    },
    image:{
        type: String
    },

}, {
    timestamps: true
})


const TradingForm = mongoose.model("TradingForm", tradingFormSchema);

export default TradingForm