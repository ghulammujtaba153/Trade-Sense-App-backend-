import Course from "../models/coursesSchema.js";
import Enrollment from "../models/enrollmentSchema.js";
import User from "../models/userSchema.js";

export const createEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await User.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
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
      .populate('course');
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error getting enrollments', error });
  }
}


export const getEnrollmentsByStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollments = await Enrollment.find({ student: id })
      .populate('student')
      .populate('course');
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error getting enrollments', error });
  }
}


export const getEnrollmentsByCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollments = await Enrollment.find({ course: id })
      .populate('student')
      .populate('course');
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error getting enrollments', error });
  }
}