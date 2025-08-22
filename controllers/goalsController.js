import Goals from "../models/goalsSchema.js";

export const createGoal = async (req, res) => {
    const { userId, title, description, status, frequency, targetDate } = req.body;

    try {

        const goal = await Goals.create({ userId, title, description, status, frequency, targetDate });

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ error: 'Error creating goal' });
    }
}

// goals

export const getGoals = async (req, res) => {
    try {
        const goals = await Goals.find().populate('userId');
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ error: 'Error getting goals' });
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
    const { title, description, frequency, targetDate, status } = req.body;

    try {
        const goal = await Goals.findByIdAndUpdate(id, { title, description, frequency, targetDate, status }, { new: true });
        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const updateGoalStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const goal = await Goals.findByIdAndUpdate(id, { status: status }, { new: true });
        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ error: 'Error updating goal' });
    }
}


export const goalAnalysis = async (req, res) => {
    console.log("goalAnalysis triggered");

    try {
        const completedGoals = await Goals.find({ status: 'completed' });
        const activeGoals = await Goals.find({ status: 'active' });

        const totalGoals= await Goals.countDocuments({});


        return res.status(200).json({ completedGoals, activeGoals, totalGoals });

    } catch (error) {
        console.error("Error analyzing goals:", error.message);
        res.status(500).json({ error: 'Error analyzing goal', details: error.message });
    }
}
