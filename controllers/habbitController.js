import Habbit from "../models/habbitSchema.js";
import mongoose from "mongoose";
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