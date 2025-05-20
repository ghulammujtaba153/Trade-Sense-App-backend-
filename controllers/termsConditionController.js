import TermsCondition from "../models/termsConditionSchema.js";

export const createTermsCondition = async (req, res) => {
    try {
        const termsCondition = await TermsCondition.findOne({});
        if (termsCondition) {
            await TermsCondition.findByIdAndUpdate(termsCondition._id, req.body, { new: true });
        } else {
            const termsCondition = await TermsCondition.create(req.body);
        }
        res.status(200).json({ message: "Terms and Condition created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getTermsCondition = async (req, res) => {
    try {
        const termsCondition = await TermsCondition.findOne({});
        res.status(200).json(termsCondition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}