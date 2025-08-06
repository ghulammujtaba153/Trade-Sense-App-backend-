import About from "../models/aboutSchema.js";

export const createAbout = async (req, res) => {
    const { title, description, primaryImage, secondaryImage } = req.body;
    try {
        const about = await About.findOne({});
        if (about) {
            await About.findByIdAndUpdate(about._id, req.body);
        } else {
            const about = await About.create(req.body);
        }

        res.status(200).json(about);
    } catch (error) {
        res.status(500).json(error);
    }
}


// dev branch



export const getAbout = async (req, res) => {
    try {
        const about = await About.findOne({});
        res.status(200).json(about);
    } catch (error) {
        res.status(500).json(error);
    }
}