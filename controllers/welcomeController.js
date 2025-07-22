import Welcome from "../models/welcomeSchema.js";

export const createWelcome = async (req, res) => {
    try {
        // Check if a welcome document already exists
        let existing = await Welcome.findOne({});

        if (existing) {
            // Update the existing document
            existing.title = req.body.title;
            existing.description = req.body.description;
            existing.features = req.body.features;
            existing.showIcons = req.body.showIcons;

            await existing.save();
            return res.status(200).json(existing);
        }

        // If not found, create a new document
        const newWelcome = await Welcome.create(req.body);
        return res.status(201).json(newWelcome);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getWelcome = async (req, res) => {
    try {
        const welcome = await Welcome.findOne({});
        if (!welcome) {
            return res.status(404).json({ message: "No welcome data found" });
        }
        return res.status(200).json(welcome);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
