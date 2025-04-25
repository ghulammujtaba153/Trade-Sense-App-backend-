import Course from "../models/coursesSchema.js";
import Enrollment from "../models/enrollmentSchema.js";
import Rating from "../models/ratingSchema.js";
import User from "../models/userSchema.js";

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
        const users = await User.find({ role: "user", isDeleted: false }).select("createdAt");
        res.status(200).json(users);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        res.status(200).json({ success: true, ratings: formatted });
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ success: false, message: "Failed to fetch rating distribution." });
    }
};


export const getEnrollmentGrowth = async (req, res) => {
    try {
        const enrollments = await Enrollment.find().select("enrolledAt");
        // console.log(enrollments);
        res.status(200).json(enrollments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

