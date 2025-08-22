import Course from "../models/coursesSchema.js";
import mongoose from "mongoose";
import ResourceCount from "../models/resourceCountSchema.js";


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
  const {id, userId} = req.body // Assuming you have user ID from auth middleware
  
  
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
              $lookup: {
                from: "resourcecounts", // Try plural first
                let: { 
                  moduleIdStr: { $toString: "$_id" },
                  moduleIdObj: "$_id"
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $or: [
                              // Try matching as string
                              { $eq: ["$resourceId", "$moduleIdStr"] },
                              // Try matching as ObjectId if resourceId is stored as ObjectId
                              { $eq: ["$resourceId", "$moduleIdObj"] }
                            ]
                          },
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
                      count: 1,
                      userId: 1, // Keep for debugging
                      resourceId: 1, // Keep for debugging
                      userIdType: { $type: "$userId" }, // Debug field
                      resourceIdType: { $type: "$resourceId" } // Debug field
                    },
                  },
                ],
                as: "countData",
              },
            },
            {
              $lookup: {
                from: "resourcecount", // Try singular as fallback
                let: { 
                  moduleIdStr: { $toString: "$_id" },
                  moduleIdObj: "$_id"
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $or: [
                              // Try matching as string
                              { $eq: ["$resourceId", "$moduleIdStr"] },
                              // Try matching as ObjectId if resourceId is stored as ObjectId
                              { $eq: ["$resourceId", "$moduleIdObj"] }
                            ]
                          },
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
                      count: 1,
                      userId: 1, // Keep for debugging
                      resourceId: 1, // Keep for debugging
                      userIdType: { $type: "$userId" }, // Debug field
                      resourceIdType: { $type: "$resourceId" } // Debug field
                    },
                  },
                ],
                as: "countDataFallback",
              },
            },
            {
              $addFields: {
                favourites: {
                  $map: {
                    input: "$favourites",
                    as: "f",
                    in: "$f.userId",
                  },
                },
                currentTime: {
                  $ifNull: [
                    { $arrayElemAt: ["$progressData.currentTime", 0] },
                    0
                  ]
                },
                accessCount: {
                  $ifNull: [
                    {
                      $cond: {
                        if: { $gt: [{ $size: "$countData" }, 0] },
                        then: { $arrayElemAt: ["$countData.count", 0] },
                        else: { $arrayElemAt: ["$countDataFallback.count", 0] }
                      }
                    },
                    0
                  ]
                },
                // Debug fields - remove these after testing
                debugCountData: "$countData",
                debugCountDataFallback: "$countDataFallback",
                debugModuleId: { $toString: "$_id" },
                debugUserId: userId
              },
            },
            // Clean up temporary fields - comment out for debugging
            // {
            //   $project: {
            //     progressData: 0,
            //     countData: 0,
            //     countDataFallback: 0,
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
    
    // Debug: Check the first module that has the ResourceCount record
    console.log('=== CHECKING MODULE WITH RESOURCECOUNT RECORD ===');
    const moduleWithCount = courses[0].courseModules.find(m => m._id.toString() === "685e8ed3bd14ca5de7533821");
    if (moduleWithCount) {
      console.log('Module with ResourceCount record (685e8ed3bd14ca5de7533821):', {
        moduleId: moduleWithCount._id,
        currentTime: moduleWithCount.currentTime,
        accessCount: moduleWithCount.accessCount,
        debugCountData: moduleWithCount.debugCountData,
        debugCountDataFallback: moduleWithCount.debugCountDataFallback,
        debugModuleId: moduleWithCount.debugModuleId,
        debugUserId: moduleWithCount.debugUserId
      });
    }

    // Debug: Also check the module you were originally looking for
    console.log('=== CHECKING MODULE WITH PROGRESS (687237074f61e55a99b896cc) ===');
    const moduleWithProgress = courses[0].courseModules.find(m => m._id.toString() === "687237074f61e55a99b896cc");
    if (moduleWithProgress) {
      console.log('Module with progress data:', {
        moduleId: moduleWithProgress._id,
        currentTime: moduleWithProgress.currentTime,
        accessCount: moduleWithProgress.accessCount,
        debugCountData: moduleWithProgress.debugCountData,
        debugCountDataFallback: moduleWithProgress.debugCountDataFallback,
        debugModuleId: moduleWithProgress.debugModuleId,
        debugUserId: moduleWithProgress.debugUserId
      });
    }
    
    // Additional debugging: Check what's actually in the ResourceCount collection
    console.log('=== DEBUGGING RESOURCE COUNT COLLECTION ===');
    console.log('Looking for userId:', userId, 'type:', typeof userId);
    console.log('Looking for resourceId: 685e8ed3bd14ca5de7533821 (the one with actual count record)');
    
    // Direct query to ResourceCount collection for debugging
    try {
      // Check the specific record that should exist
      const directQuerySpecific = await mongoose.connection.db.collection('resourcecounts').find({
        userId: new mongoose.Types.ObjectId(userId),
        resourceId: "685e8ed3bd14ca5de7533821"
      }).toArray();
      console.log('Direct query for specific record (resourcecounts):', directQuerySpecific);
      
      // Try alternative userId formats
      const directQueryString = await mongoose.connection.db.collection('resourcecounts').find({
        userId: userId,
        resourceId: "685e8ed3bd14ca5de7533821"
      }).toArray();
      console.log('Direct query with string userId:', directQueryString);
      
      // Try with ObjectId resourceId
      const directQueryObjId = await mongoose.connection.db.collection('resourcecounts').find({
        userId: new mongoose.Types.ObjectId(userId),
        resourceId: new mongoose.Types.ObjectId("685e8ed3bd14ca5de7533821")
      }).toArray();
      console.log('Direct query with ObjectId resourceId:', directQueryObjId);
      
      // Get all records for this user
      const allUserRecords = await mongoose.connection.db.collection('resourcecounts').find({
        userId: new mongoose.Types.ObjectId(userId)
      }).toArray();
      console.log('All ResourceCount records for this user:', allUserRecords);
      
      // Check collection names
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name).filter(name => name.includes('resource'));
      console.log('Available collections containing "resource":', collectionNames);
      
    } catch (debugError) {
      console.error('Debug query error:', debugError);
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
