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

  const now = new Date();

  try {
    const habbits = await Habbit.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "habitlogs",
          localField: "_id",
          foreignField: "habitId",
          as: "habitLogs",
        },
      },
      {
        $addFields: {
          completedCount: {
            $size: {
              $filter: {
                input: "$habitLogs",
                as: "log",
                cond: { $eq: ["$$log.status", "completed"] },
              },
            },
          },
          expectedCount: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$type", "daily"] },
                  then: {
                    $add: [
                      {
                        $dateDiff: {
                          startDate: "$createdAt",
                          endDate: "$targetDate",
                          unit: "day",
                        },
                      },
                      1,
                    ],
                  },
                },
                {
                  case: { $eq: ["$type", "weekly"] },
                  then: {
                    $add: [
                      {
                        $dateDiff: {
                          startDate: "$createdAt",
                          endDate: "$targetDate",
                          unit: "week",
                        },
                      },
                      1,
                    ],
                  },
                },
                {
                  case: { $eq: ["$type", "monthly"] },
                  then: {
                    $add: [
                      {
                        $dateDiff: {
                          startDate: "$createdAt",
                          endDate: "$targetDate",
                          unit: "month",
                        },
                      },
                      1,
                    ],
                  },
                },
              ],
              default: 1,
            },
          },
        },
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
                      100,
                    ],
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          isChecked: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$type", "daily"] },
                  then: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$habitLogs",
                            as: "log",
                            cond: {
                              $and: [
                                { $eq: ["$$log.status", "completed"] },
                                {
                                  $eq: [
                                    { $dateToString: { format: "%Y-%m-%d", date: "$$log.date" } },
                                    new Date().toISOString().slice(0, 10),
                                  ],
                                },
                              ],
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                {
                  case: { $eq: ["$type", "weekly"] },
                  then: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$habitLogs",
                            as: "log",
                            cond: {
                              $and: [
                                { $eq: ["$$log.status", "completed"] },
                                {
                                  $eq: [
                                    { $isoWeek: "$$log.date" },
                                    { $isoWeek: now },
                                  ],
                                },
                              ],
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
                {
                  case: { $eq: ["$type", "monthly"] },
                  then: {
                    $gt: [
                      {
                        $size: {
                          $filter: {
                            input: "$habitLogs",
                            as: "log",
                            cond: {
                              $and: [
                                { $eq: ["$$log.status", "completed"] },
                                {
                                  $and: [
                                    {
                                      $eq: [
                                        { $year: "$$log.date" },
                                        { $year: now },
                                      ],
                                    },
                                    {
                                      $eq: [
                                        { $month: "$$log.date" },
                                        { $month: now },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              ],
              default: false,
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
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


