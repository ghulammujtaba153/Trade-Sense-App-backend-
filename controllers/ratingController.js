import Rating from "../models/ratingSchema.js";

export const createRatings = async (req, res) => {
    const { userId, courseId, rating, comment } = req.body;
    try {
        const newRating = await Rating.create({ userId, courseId, rating, comment });
        res.status(201).json(newRating);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getRatingsByCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const ratings = await Rating.find({ courseId: id });
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}