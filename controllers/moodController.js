import Mood from "../models/moodSchema.js";



export const createMood = async (req, res) => {
    try {
        const mood = await Mood.create(req.body);
        res.status(201).json(mood);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const getMood = async (req, res) => {
    try {
        const mood = await Mood.find( {userId: req.params.id});
        res.status(200).json(mood);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const updateMood = async (req, res) => {
    try {
        const mood = await Mood.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(mood);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}