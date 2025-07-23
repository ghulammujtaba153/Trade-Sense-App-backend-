import Music from "../models/musicSchema.js";


export const createMusic = async (req, res) => {
    try {
        const music = await Music.create(req.body);
        res.status(201).json({
            success: true,
            message: "Music created successfully",
            music,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Music creation failed",
            error: error.message,
        });
    }
}


export const getAllMusic = async (req, res) => {
    try {
        const music = await Music.find({ isDeleted: false });
        res.status(200).json({
            success: true,
            message: "Music fetched successfully",
            music,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Music fetching failed",
            error: error.message,
        });
    }
}



export const getMusicById = async (req, res) => {
    try {
        const music = await Music.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Music fetched successfully",
            music,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Music fetching failed",
            error: error.message,
        });
    }
}

export const updateMusic = async (req, res) => {

    try {
        const music = await Music.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "Music updated successfully",
            music,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Music updating failed",
            error: error.message,
        });
    }
}


export const deleteMusic = async (req, res) => {
    try {
        const music = await Music.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).json({
            success: true,
            message: "Music deleted successfully",
            music,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Music deletion failed",
            error: error.message,
        });
    }
}