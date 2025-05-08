import PillarsCategories from "../models/pillarsCategoriesSchema.js";


export const createPillarsCategories = async (req, res) => {
    const {name, categories} = req.body;

    try {
        const pillarsCategories = new PillarsCategories({name, categories});
        await pillarsCategories.save();
        res.status(201).json(pillarsCategories);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getAllPillarsCategories = async (req, res) => {
    try {
        const pillarsCategories = await PillarsCategories.find();
        res.status(200).json(pillarsCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const updatePillarsCategories = async (req, res) => {
    const { id } = req.params;
    const { name, categories } = req.body;

    try {
        const updatedPillarsCategories = await PillarsCategories.findByIdAndUpdate(
            id,
            { name, categories },
            { new: true }
        );
        res.status(200).json(updatedPillarsCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const deletePillarsCategories = async (req, res) => {
    const { id } = req.params;

    try {
        await PillarsCategories.findByIdAndDelete(id);
        res.status(200).json({ message: "Pillars Categories deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getAllCategories = async (req, res) => {
    try {
      const pillarsCategories = await PillarsCategories.find();
  

      const allCategories = pillarsCategories.reduce((acc, curr) => {
        return acc.concat(curr.categories);
      }, []);
  
      res.status(200).json({ categories: allCategories });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };