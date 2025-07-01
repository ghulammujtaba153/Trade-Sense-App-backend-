import onBoardingQuestionnaire from "../models/onBoardingQuestionnaireSchema.js";
import Tags from "../models/TagsSchema.js";

export const createOnBoardingQuestionnaire = async (req, res) => {
    try {
        const onBoarding = await onBoardingQuestionnaire.create(req.body);

        res.status(201).json(onBoarding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getOnBoardingQuestionnaire = async (req, res) => {

    try {
        const onBoarding = await onBoardingQuestionnaire.find({isDeleted: false});
        return res.status(200).json(onBoarding);
        
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}


export const updateOnBoardingQuestionnaire = async (req, res) => {
    try {
        const onBoarding = await onBoardingQuestionnaire.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json(onBoarding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const deleteOnBoardingQuestionnaire = async (req, res) => {
    try {
        await onBoardingQuestionnaire.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json({ message: "Onboarding Questionnaire deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


