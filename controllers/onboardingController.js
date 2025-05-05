import OnBoarding from "../models/onBoardingSchema.js";

export const createOnboarding = async (req, res) => {
    const {userId, questions } =req.body;
    try {
        const newOnboarding = await OnBoarding.create({ userId, questions });
        res.status(201).json(newOnboarding);   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getOnboarding = async (req, res) => {
    const {id} = req.params;
    try {
        const onboarding = await OnBoarding.find({userId: id});
        res.status(200).json(onboarding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


