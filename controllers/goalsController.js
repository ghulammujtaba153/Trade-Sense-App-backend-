import Goals from "../models/goalsSchema.js";

export const createGoal = async (req, res) => {
    const { userId, title, description, frequency, targetDate } = req.body;

    try {

        const goal = await Goals.create({ userId, title, description, frequency, targetDate });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ error: 'Error creating goal' });
    }
}


export const getGoalsByUser = async (req, res) => {
    const {id} = req.params;

    try {
        const goals = await Goals.find({ userId: id });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ error: 'Error getting goals' });
    }
}


export const deleteGoal = async (req, res) => {
    const { id } = req.params;

    try {
        const goal = await Goals.findByIdAndDelete(id);
        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting goal' });
    }
}

export const updateGoal = async (req, res) => {
    const { id } = req.params;
    const { title, description, frequency, targetDate, reminders } = req.body;

    try {
        const goal = await Goals.findByIdAndUpdate(id, { title, description, frequency, targetDate, reminders }, { new: true });
        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ error: 'Error updating goal' });
    }
}