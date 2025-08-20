import Affiliate from "../models/affiliateSchema.js";
import mongoose from "mongoose"
import User from "../models/userSchema.js";
import Account from "../models/accountSchema.js";
import Course from './../models/coursesSchema.js';



export const createAffiliate = async (req, res) => {

  const { referrerUserId, courseId, type } = req.body;

  try {
    console.log(req.body);

    const user = await User.findOne({ affiliateCode: referrerUserId });
    if (!user) return res.status(404).json({ error: "Referrer user not found" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const data = {
      referrerUserId: user._id,
      courseId,
      type
    };

    const affiliate = await Affiliate.create(data);

    let account = await Account.findOne({ userId: user._id });
    if (!account) {
      account = await Account.create({ userId: user._id, balance: 0, enrollmentProfit: 2, visitProfit: 2 });
    }

    let profitToAdd = 0;

    if (type === 'visited') {
      profitToAdd = (account.visitProfit / 100) * course.price;
    } else if (type === 'enrolled') {
      profitToAdd = (account.enrollmentProfit / 100) * course.price;
    }

    account.balance += profitToAdd;
    await account.save();

    res.status(200).json(affiliate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}




export const getAffiliates = async (req, res) => {
  const { id } = req.params;

  try {
    const affiliates = await Affiliate.aggregate([
      {
        $match: { referrerUserId: new mongoose.Types.ObjectId(id) }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // format counts
    const stats = {
      visited: 0,
      enrolled: 0,
      money: 0
    };

    affiliates.forEach((entry) => {
      stats[entry._id] = entry.count;
    });

    stats.money = await Account.findOne({ userId: id }).then(account => account ? account.balance : 0);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const getAffiliatesRecords = async (req, res) => {
  const { id } = req.params;

  try {
    const affiliate = await Affiliate.find({ referrerUserId: id });

    res.status(200).json(affiliate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const getAffiliateUsers = async (req, res) => {

  try {
    const users = await User.find({affiliateCode: {$ne: null}});

    console.log(users)
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



export const revokeAffiliate = async (req, res) => {

  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {affiliateCode: null, isAffiliate: false});
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}