import Course from "../models/coursesSchema.js";
import mongoose from "mongoose";

export const createCourse = async (req, res) => {
  try {
    const { creator, title, thumbnail, description, plan, isPremium, price } =
      req.body;
    const course = await Course.create({
      creator,
      title,
      thumbnail,
      description,
      plan,
      isPremium,
      price,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "courseId",
          as: "ratings",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: {
          path: "$creator",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $lookup: {
          from: "coursemodules",
          localField: "_id",
          foreignField: "courseID",
          as: "courseModules",
        },
      },
      {
        $unwind: {
          path: "$instructor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" },
          totalRatings: { $size: "$ratings" },
        },
      },
    ]);

    console.log("courses", courses);
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error in getAllCourses:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCourse = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId; // Assuming you have user ID from auth middleware
  
  // Debug: Log the userId to make sure it's correct
  console.log('User ID:', userId);
  console.log('User ID type:', typeof userId);
  
  try {
    const courses = await Course.aggregate([
      {
        $match: {
          isDeleted: false,
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $unwind: {
          path: "$creator",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $unwind: {
          path: "$instructor",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "plan",
          foreignField: "_id",
          as: "plans",
        },
      },
      {
        $lookup: {
          from: "coursemodules",
          let: { courseID: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$courseID", "$$courseID"]
                }
              }
            },
            {
              $lookup: {
                from: "favourites",
                let: { moduleId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$itemId", "$$moduleId"],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      userId: 1,
                    },
                  },
                ],
                as: "favourites",
              },
            },
            {
              $lookup: {
                from: "resourceprogresses", // Ensure this matches your actual collection name
                let: { moduleIdStr: { $toString: "$_id" } },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$resourceId", "$$moduleIdStr"] },
                          {
                            $or: [
                              // Handle case where userId is stored as ObjectId
                              { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                              // Handle case where userId is stored as string
                              { $eq: ["$userId", userId] },
                              // Handle case where userId needs to be converted to string for comparison
                              { $eq: [{ $toString: "$userId" }, userId] }
                            ]
                          }
                        ]
                      }
                    }
                  },
                  {
                    $project: {
                      _id: 0,
                      currentTime: 1,
                      userId: 1, // Keep for debugging
                      resourceId: 1 // Keep for debugging
                    },
                  },
                ],
                as: "progressData",
              },
            },
            {
              $addFields: {
                favourites: {
                  $map: {
                    input: "$favourites",
                    as: "f",
                    in: "$$f.userId",
                  },
                },
                currentTime: {
                  $ifNull: [
                    { $arrayElemAt: ["$progressData.currentTime", 0] },
                    0
                  ]
                },
               
              },
            },
            // Temporarily comment out the $project stage for debugging
            // {
            //   $project: {
            //     progressData: 0, // Remove the temporary progressData field
            //   },
            // },
          ],
          as: "courseModules",
        },
      }
    ]);
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    // Debug: Log the result for the module that should have progress
    const moduleWithProgress = courses[0].courseModules.find(m => m._id.toString() === "687237074f61e55a99b896cc");
    if (moduleWithProgress) {
      console.log('Module with expected progress:', {
        moduleId: moduleWithProgress._id,
        currentTime: moduleWithProgress.currentTime,
        debugData: moduleWithProgress.debugProgressData
      });
    }
    
    res.status(200).json(courses[0]);
  } catch (error) {
    console.error('Aggregation error:', error);
    res.status(500).json({ error: error.message });
  }
};


export const updateCourse = async (req, res) => {
  try {
    const {
      creator,
      title,
      thumbnail,
      description,
      duration,
      plan,
      price,
      status,
      isPremium,
      certificateAvailable,
    } = req.body;
    const course = await Course.findByIdAndUpdate(req.params.id, {
      creator,
      title,
      thumbnail,
      description,
      duration,
      plan,
      price,
      status,
      isPremium,
      certificateAvailable,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const course = await Course.findByIdAndUpdate(req.params.id, {
      status: status,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCoursesByCreator = async (req, res) => {
  const { id } = req.params;

  try {
    const courses = await Course.find({ creator: id })
      .populate("creator")
      .populate("instructor");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignInstructor = async (req, res) => {
  try {
    const { instructorId } = req.body;
    const course = await Course.findByIdAndUpdate(req.params.id, {
      instructor: instructorId,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCoursesByInstructor = async (req, res) => {
  const { id } = req.params;

  try {
    const courses = await Course.find({ instructor: id })
      .populate("creator")
      .populate("instructor");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
