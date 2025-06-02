import onBoardingQuestionnaire from "../models/onBoardingQuestionnaireSchema.js";

export const createOnBoardingQuestionnaire = async (req, res) => {
    try {
        const { type, image, text } = req.body;
        console.log(req.body);

        const data={};
        data.type=type;
        data.text=text;
        if(image){
            data.image=image
        }

        const onBoarding = await onBoardingQuestionnaire.create(data);
        res.status(201).json(onBoarding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getOnBoardingQuestionnaire = async (req, res) => {
    try {
        const onBoarding = await onBoardingQuestionnaire.find();
        res.status(200).json(onBoarding);
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}


export const updateOnBoardingQuestionnaire = async (req, res) => {
    try {
        const { type, image, text } = req.body;

        const data={};
        data.type=type;
        data.text=text;
        if(image){
            data.image=image
        }
        const onBoarding = await onBoardingQuestionnaire.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(200).json(onBoarding);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const deleteOnBoardingQuestionnaire = async (req, res) => {
    try {
        await onBoardingQuestionnaire.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Onboarding Questionnaire deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


