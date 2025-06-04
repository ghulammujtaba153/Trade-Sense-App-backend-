import TermsCondition from "../models/termsConditionSchema.js";

export const createTermsCondition = async (req, res) => {
    try {
        const termsCondition = await TermsCondition.create(req.body);
        res.status(200).json({ message: "Terms and Condition created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getTermsCondition = async (req, res) => {
    try {
        const termsCondition = await TermsCondition.find({});
        res.status(200).json(termsCondition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const updateTermsCondition = async (req, res) => {
    const { id } = req.params;
    try {
        const termsCondition = await TermsCondition.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(termsCondition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTermsCondition = async (req, res) => {
    const { id } = req.params;
    try {
        const termsCondition = await TermsCondition.findByIdAndDelete(id);
        res.status(200).json(termsCondition);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}