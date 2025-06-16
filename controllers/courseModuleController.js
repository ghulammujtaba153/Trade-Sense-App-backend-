import CourseModule from "../models/courseModuleSchema.js";
import mongoose from "mongoose";

export const createCourseModule = async (req, res) => {
    try {
        const newCourseModule = await CourseModule.create(req.body);
        res.status(201).json(newCourseModule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}





export const getCourseModules = async (req, res) => {
  const { id } = req.params;

  try {
    const courseModules = await CourseModule.aggregate([
      {
        $match: { courseID: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "favourites",
          let: { moduleId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$itemId", "$$moduleId"] }
              }
            },
            {
              $project: { userId: 1, _id: 0 }
            }
          ],
          as: "favoriteDocs"
        }
      },
      {
        $addFields: {
          favorites: {
            $map: {
              input: "$favoriteDocs",
              as: "fav",
              in: "$$fav.userId"
            }
          }
        }
      },
      {
        $project: {
          favoriteDocs: 0 
        }
      }
    ]);

    res.status(200).json(courseModules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const  deleteCourseModule = async (req, res) => {
    const { id } = req.params;
    try {
        const courseModule = await CourseModule.findByIdAndDelete(id);
        res.status(200).json(courseModule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
