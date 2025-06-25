import Affiliate from "../models/affiliateSchema.js";
import mongoose from "mongoose"

export const createAffiliate = async (req, res) => {
    try {
        const affiliate = await Affiliate.create(req.body);
        res.status(200).json(affiliate);
    } catch (error) {
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
    };

    affiliates.forEach((entry) => {
      stats[entry._id] = entry.count;
    });

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
