import AffiliateRequests from "../models/affiliateRequestsSchema.js";


export const createAffiliateRequest = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Check if the user already has an affiliate request
    const existingAffiliate = await AffiliateRequests.findOne({ userId });

    // Only run these checks if a record exists
    if (existingAffiliate) {
      if (existingAffiliate.status === "accepted") {
        return res.status(400).json({ error: "User is already an affiliate" });
      } else if (existingAffiliate.status === "pending") {
        return res.status(400).json({ error: "Affiliate request is already pending" });
      } else if (existingAffiliate.status === "rejected") {
        return res.status(400).json({ error: "Affiliate request was rejected" });
      }
    }

    // Create a new affiliate request
    const affiliateRequest = await AffiliateRequests.create(req.body);
    res.status(200).json(affiliateRequest);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getAffiliateRequest = async (req, res) => {
    const {id} = req.params;

    try {
        const affiliateRequests =  await AffiliateRequests.find({userId: id})
        res.status(200).json(affiliateRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const getAffiliateRequests = async (req, res) => {
    try {
        const affiliateRequests =  await AffiliateRequests.find({}).populate('userId').sort({createdAt: -1});
        res.status(200).json(affiliateRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const updateStatus = async (req, res) => {
    const {id} = req.params;

    try {
        const affiliateRequest = await AffiliateRequests.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json(affiliateRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}