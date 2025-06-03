import HabitLog from "../models/habitLogSchema.js";


export const createHabitLog = async (req, res) => {
  try {
    const {userId, habitId, status } = req.body;
    const habitLog = new HabitLog({ userId, habitId, status });
    await habitLog.save();
    res.status(201).json(habitLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}