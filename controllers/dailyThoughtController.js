import DailyThought from "../models/dailyThoughtSchema.js";


export const createDailyThought = async (req, res) => {
    try {
        const dailyThought = await DailyThought.create( req.body );

        res.status(201).json({
            success: true,
            dailyThought
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const getDailyThought = async (req, res) => {
    try {
        const dailyThought = await DailyThought.findOne({ }).populate("instructor").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            dailyThought
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const getDailyThoughtById = async (req, res) => {
    try {
        const dailyThought = await DailyThought.findById(req.params.id).populate("instructor");

        res.status(200).json({
            success: true,
            dailyThought
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const getDailyThoughts = async (req, res) => {
    try {
        const dailyThoughts = await DailyThought.find().populate("instructor").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            dailyThoughts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const updateDailyThought = async (req, res) => {
    try {
        const dailyThought = await DailyThought.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            success: true,
            dailyThought
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const deletDailyThought = async (req, res) => {
    try {
        await DailyThought.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Daily thought deleted successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
