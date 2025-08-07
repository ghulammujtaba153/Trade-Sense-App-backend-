import DeleteRequest from "../models/deleteRequests.js";


export const createDeleteRequest = async (req, res) => {
    try {
        const deleteRequest = await DeleteRequest.create(req.body);
        res.status(200).json(deleteRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getDeleteRequests = async (req, res) => {
    try {
        const deleteRequests = await DeleteRequest.find({}).populate("userId");
        res.status(200).json(deleteRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getDeleteRequest = async (req, res) => {
    const {id} = req.params;

    try {
        const deleteRequest = await DeleteRequest.find({userId: id}).populate("userId");
        res.status(200).json(deleteRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}