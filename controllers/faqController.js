

export const createFaq = async (req, res) => {
    const { question, answer } = req.body;
    try {
        const newFaq = await Faq.create({ question, answer });
        res.status(201).json(newFaq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find({});
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const deleteFaq = async (req, res) => {
    const {id} = req.params;
    try {
        const deletedFaq = await Faq.findByIdAndDelete(id);
        res.status(200).json(deletedFaq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateFaq = async (req, res) => {
    const {id} = req.params;
    const {question, answer} = req.body;
    try {
        const updatedFaq = await Faq.findByIdAndUpdate(id, {question, answer}, {new: true});
        res.status(200).json(updatedFaq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}