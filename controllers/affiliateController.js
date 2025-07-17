import Affiliate from "../models/affiliateSchema.js";
import mongoose from "mongoose"
import User from "../models/userSchema.js";

export const createAffiliate = async (req, res) => {

  const {referrerUserId, courseId, type} = req.body

    try {
      console.log(req.body)

        const user = await User.findOne({affiliateCode: req.body.referrerUserId});


        const data ={}


        data.referrerUserId = user._id;
        data.courseId = courseId;
        data.type = type

        const affiliate = await Affiliate.create(data);
        res.status(200).json(affiliate);
    } catch (error) {
      console.log(error)
      req.status(500).json({ error: error.message });
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

    stats.money = stats.visited * .5 + stats.enrolled * 5;

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