import Habbit from "../models/habbitSchema.js";

export const createHabbit = async (req, res) => {
    const { userId, title, description, frequency } = req.body;

    try {

        const goal = await Habbit.create({ userId, title, description, frequency });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ error: 'Error creating goal' });
    }
}


export const getHabbitsByUser = async (req, res) => {
    const {id} = req.params;

    try {
        const habbits = await Habbit.find({ userId: id });
        res.status(200).json(habbits);
    } catch (error) {
        res.status(500).json({ error: 'Error getting habbits' });
    }
}


export const deleteHabbit = async (req, res) => {
    const { id } = req.params;

    try {
        const habbit = await Habbit.findByIdAndDelete(id);
        res.status(200).json(habbit);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting habbit' });
    }
}

export const updateHabbit = async (req, res) => {
    const { id } = req.params;
    const { title, description, frequency, status, reminders } = req.body;

    try {
        const habbit = await Habbit.findByIdAndUpdate(id, { title, description, frequency, reminders, status }, { new: true });
        res.status(200).json(habbit);
    } catch (error) {
        res.status(500).json({ error: 'Error updating habbit' });
    }
}