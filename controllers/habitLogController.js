import HabitLog from "../models/habitLogSchema.js";


export const createHabitLog = async (req, res) => {
  try {
    const {userId, habitId, status } = req.body;
    // Check if the habit already exists for the user
    const existingHabitLog = await HabitLog.findOne({ userId, habitId, date: new Date() });
    if (existingHabitLog) {
      res.status(400).json({ error: "Habit log already exists for this user and habit" });
    }
    const habitLog = new HabitLog({ userId, habitId, status });
    await habitLog.save();
    res.status(201).json(habitLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}