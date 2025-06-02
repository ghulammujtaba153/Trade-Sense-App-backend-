import Course from "../models/coursesSchema.js";
import Enrollment from "../models/enrollmentSchema.js";
import Rating from "../models/ratingSchema.js";
import User from "../models/userSchema.js";
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns'

export const getAdminDashboardInfo =async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user", isDeleted: false });
        const coursePublished = await Course.countDocuments({ status: "published" });
        // const activePlans = await Enrollment.countDocuments({ status: "active" });
        const totalEnrollments = await Enrollment.countDocuments();
        const activeEnrollments = await Enrollment.countDocuments({ status: "active" });

        
        res.status(200).json({ totalUsers, coursePublished, totalEnrollments, activeEnrollments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getUserGrowth = async (req, res) => {
  try {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })     // Sunday

    // Fetch all users created this week
    const users = await User.find({
      role: 'user',
      isDeleted: false,
      createdAt: { $gte: weekStart, $lte: weekEnd }
    }).select('createdAt')

    // Initialize daily counts for Mon-Sun
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const dailyCounts = days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const count = users.filter(user => format(new Date(user.createdAt), 'yyyy-MM-dd') === dateStr).length
      return count
    })

    res.status(200).json(dailyCounts) // e.g. [0, 2, 1, 0, 0, 3, 0]

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const getRatings = async (req, res) => {
    try {
        const ratings = await Rating.aggregate([
            {
                $group: {
                    _id: "$rating", 
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 } 
            }
        ]);

        const formatted = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        ratings.forEach(item => {
            formatted[item._id] = item.count;
        });

        console.log("formatted");


        res.status(200).json({ success: true, ratings: formatted });
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ success: false, message: "Failed to fetch rating distribution." });
    }
};


export const getEnrollmentGrowth = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
        res.status(200).json(enrollments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

