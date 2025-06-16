import Course from "../models/coursesSchema.js";
import Enrollment from "../models/enrollmentSchema.js";
import User from "../models/userSchema.js";
import mongoose from "mongoose";

export const createEnrollment = async (req, res) => {
  try {
    const { studentId, courseId, plan } = req.body;

    const student = await User.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }


    const checkEnrollment = await Enrollment.findOne({ student: studentId, course: courseId, status: 'active' });

    if (checkEnrollment) {
      return res.status(400).json({ message: 'Enrollment already exists' });
    }
    

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      plan: plan
    });

    await enrollment.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating enrollment', error });
  }
};

export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student')
      .populate('course')
      .populate('plan');
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error getting enrollments', error });
  }
}



export const getEnrollmentsByStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollments = await Enrollment.aggregate([
      {
        $match: { student: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },

      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },

      {
        $lookup: {
          from: 'users',
          localField: 'course.instructor',
          foreignField: '_id',
          as: 'instructor'
        }
      },
      { $unwind: { path: '$instructor', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'plans',
          localField: 'plan',
          foreignField: '_id',
          as: 'plan'
        }
      },
      { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'ratings',
          localField: 'course._id',
          foreignField: 'courseId',
          as: 'ratings'
        }
      },

      {
        $addFields: {
          averageRating: { $avg: '$ratings.rating' },
          totalRatings: { $size: '$ratings' }
        }
      },

      // Optional: shape or project fields if needed
      // {
      //   $project: {
      //     student: 1,
      //     course: 1,
      //     instructor: 1,
      //     plan: 1,
      //     averageRating: 1,
      //     totalRatings: 1,
      //     paymentStatus: 1,
      //     status: 1,
      //     enrolledAt: 1
      //   }
      // }
    ]);

    res.status(200).json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Error getting enrollments', error });
  }
};




export const getEnrollmentsByCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollments = await Enrollment.find({ course: id })
      .populate('student')
      .populate('plan');
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error getting enrollments', error });
  }
}