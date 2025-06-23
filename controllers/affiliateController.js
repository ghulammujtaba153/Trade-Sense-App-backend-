import Affiliate from "../models/affiliateSchema.js";


export const createAffiliate = async (req, res) => {
    try {
        const affiliate = await Affiliate.create(req.body);
        res.status(200).json(affiliate);
    } catch (error) {
        req.status(500).json({ error: error.message });
    }
}


export const getAffiliates = async (req, res) => {
    const {id} = req.params;
    try {
        const affiliates = await Affiliate.find({referrerUserId: id}).populate('courseId').populate('visitorId');
        res.status(200).json(affiliates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}