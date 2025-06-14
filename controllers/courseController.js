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

  try {
    const courses = await Course.aggregate([
      { $match: { isDeleted: false, _id: new mongoose.Types.ObjectId(id) } },

      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $unwind: { path: "$creator", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "users",
          localField: "instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      { $unwind: { path: "$instructor", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "plans",
          localField: "plan", // assuming `plan` is now an array
          foreignField: "_id",
          as: "plans", // rename to `plans` (plural)
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
    ]);

    if (!courses || courses.length === 0) {``
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(courses[0]); // send single course object
  } catch (error) {
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
