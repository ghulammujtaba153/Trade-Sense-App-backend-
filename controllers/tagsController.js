import Tags from "../models/TagsSchema.js";


export const createTags = async (req, res) => {
    const { name } = req.body;
    try {
        const newTag = await Tags.create({ name });
        res.status(201).json(newTag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getTags = async (req, res) => {
    console.log("get tags");
    try {
        const tags = await Tags.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTag = await Tags.findByIdAndDelete(id);
        res.status(200).json(deletedTag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}