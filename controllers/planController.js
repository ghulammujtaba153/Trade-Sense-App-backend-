import Plan from "../models/planSchema.js";

export const createPlan = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const plan = await Plan.create({ name, price, description, category });
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updatePlan = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const plan = await Plan.findByIdAndUpdate(req.params.id, { name, price, description, category }, { new: true });
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}