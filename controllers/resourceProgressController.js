import ResourceProgress from "../models/resourceProgressSchema.js";

export const createProgress = async (req, res) => {
    try {
        const { userId, resourceId, currentTime } = req.body;

        const progress = await ResourceProgress.create({ userId, resourceId, progress });

        res.status(201).json(progress);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getProgress = async (req, res) => {
    const { userId, resourceId } = req.body;

    try {
        const progress = await ResourceProgress.findOne({ userId, resourceId });

        res.status(200).json(progress);

    } catch (error) {
        res.status(500).json({ message: error.message });   
    }
}

export const updateProgress = async (req, res) => {
    const { userId, resourceId, currentTime } = req.body;
    try {
        const progress = await ResourceProgress.findOneAndUpdate({ userId, resourceId }, { progress: currentTime }, { new: true });

        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}