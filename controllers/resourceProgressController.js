import ResourceProgress from "../models/resourceProgressSchema.js";

export const createProgress = async (req, res) => {
    try {
        const { userId, resourceId, currentTime } = req.body;

        const progress = await ResourceProgress.findOne({ userId, resourceId });

        if (progress) {
            progress.currentTime = currentTime;
            await progress.save();
            return res.status(200).json(progress);
        }

        const newProgress = await ResourceProgress.create({ userId, resourceId, currentTime });

        res.status(201).json(newProgress);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getProgress = async (req, res) => {
    const { id } = req.params;

    try {
        const progress = await ResourceProgress.find({ userId : id });

        res.status(200).json(progress);

    } catch (error) {
        res.status(500).json({ message: error.message });   
    }
}

