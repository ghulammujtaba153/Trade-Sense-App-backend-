import Habbit from "../models/habbitSchema.js";
import mongoose from "mongoose";
import HabitLog from "../models/habitLogSchema.js";
// import moment from "moment";

export const createHabbit = async (req, res) => {
    const { userId, title, description, type, status, targetDate} = req.body;

    try {

        const goal = await Habbit.create({ userId, title, description, type, status, targetDate});

        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ error: 'Error creating goal' });
    }
}






export const getHabbitsByUser = async (req, res) => {
  const { id } = req.params;
  

  try {
    const habbits = await Habbit.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: "habitlogs",
          localField: "_id",
          foreignField: "habitId",
          as: "habitLogs"
        }
      },
      {
        $addFields: {
          completedCount: {
            $size: {
              $filter: {
                input: "$habitLogs",
                as: "log",
                cond: { $eq: ["$$log.status", "completed"] }
              }
            }
          },
          expectedCount: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$type", "daily"] },
                  then: {
                    $round: [
                      {
                        $add: [
                          {
                            $divide: [
                              { $subtract: [new Date(), "$createdAt"] },
                              1000 * 60 * 60 * 24 // milliseconds in a day
                            ]
                          },
                          1
                        ]
                      },
                      0
                    ]
                  }
                },
                {
                  case: { $eq: ["$type", "weekly"] },
                  then: {
                    $round: [
                      {
                        $add: [
                          {
                            $divide: [
                              { $subtract: [new Date(), "$createdAt"] },
                              1000 * 60 * 60 * 24 * 7 // milliseconds in a week
                            ]
                          },
                          1
                        ]
                      },
                      0
                    ]
                  }
                },
                {
                  case: { $eq: ["$type", "monthly"] },
                  then: {
                    $round: [
                      {
                        $add: [
                          {
                            $divide: [
                              { $subtract: [new Date(), "$createdAt"] },
                              1000 * 60 * 60 * 24 * 30 // milliseconds in a month
                            ]
                          },
                          1
                        ]
                      },
                      0
                    ]
                  }
                }
              ],
              default: 1
            }
          }
        }
      },
      {
        $addFields: {
          progress: {
            $cond: [
              { $lte: ["$expectedCount", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$completedCount", "$expectedCount"] },
                      100
                    ]
                  },
                  0
                ]
              }
            ]
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);


    res.status(200).json(habbits);
  } catch (error) {
    console.error("Error getting habbits:", error);
    res.status(500).json({ error: "Error getting habbits" });
  }
};




export const deleteHabbit = async (req, res) => {
    const { id } = req.params;
    console.log("id", id);

    try {
        const habbit = await Habbit.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        res.status(200).json(habbit);
    } catch (error) {
        console.error("Error deleting habbit:", error);
        res.status(500).json({ error: 'Error deleting habbit' });
    }
};


export const updateHabbit = async (req, res) => {
    const { id } = req.params;
    const { title, description, type, status, targetDate} = req.body;
    

    try {
        const habbit = await Habbit.findByIdAndUpdate(id, { title, description, type, status , targetDate}, { new: true });
        res.status(200).json(habbit);
    } catch (error) {
        res.status(500).json({ error: 'Error updating habbit' });
    }
}










export const habitStats = async (req, res) => {
  const { id } = req.params;

  console.log("id", id);

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // 1. Get total, completed, pending habits
    const habitStats = await Habbit.aggregate([
      {
        $match: {
          isDeleted: false,
          userId: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        },
      },
    ]);

    console.log("habitStats", habitStats);

    // 2. Get completed habit logs (sorted by date)
    const habitLogs = await HabitLog.find({
      userId: new mongoose.Types.ObjectId(id),
      status: 'completed',
    }).sort({ date: -1 });

    // 3. Calculate streak (consecutive days)
    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const log of habitLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      // Expected date for this streak iteration
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);

      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    // 4. Send response
    res.status(200).json({
      total: habitStats[0]?.total || 0,
      completed: habitStats[0]?.completed || 0,
      pending: habitStats[0]?.pending || 0,
      streak,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


