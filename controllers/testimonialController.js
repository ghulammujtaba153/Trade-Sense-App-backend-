import Testimonial from "../models/testimonialSchema.js";

export const createTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findOne({});
        if(testimonial) {
            await Testimonial.findOneAndUpdate(testimonial._id, req.body);
            return res.status(200).json({message: "Testimonial updated successfully"});
        }
        const newTestimonial = await Testimonial.create(req.body);
        return res.status(200).json({message: "Testimonial created successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const getTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findOne({});
        return res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const addTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findOne({});
        if(testimonial) {
            testimonial.testimonials.push(req.body);
            await testimonial.save();
            return res.status(200).json({message: "Testimonial added successfully"});
        }
        res.status(404).json({message: "Testimonial not found"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const updateTestimonial = async (req, res) => {
    const { id } = req.params;
    try {
        const testimonial = await Testimonial.findOne({});
        if(testimonial) {
            testimonial.testimonials[id] = req.body;
            await testimonial.save();
            return res.status(200).json({message: "Testimonial updated successfully"});
        }
        res.status(404).json({message: "Testimonial not found"});
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const deleteTestimonial = async (req, res) => {
    const { id } = req.params;
    try {
        const testimonial = await Testimonial.findOne({});
        if(testimonial) {
            testimonial.testimonials.splice(id, 1);
            await testimonial.save();
            return res.status(200).json({message: "Testimonial deleted successfully"});
        }
        res.status(404).json({message: "Testimonial not found"});
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
    for (let i = 0; i < testimonial.testimonials.length; i++) {
        if (testimonial.testimonials[i].id == id) {
            testimonial.testimonials.splice(i, 1);
            await testimonial.save();
            return res.status(200).json({message: "Testimonial deleted successfully"}); 
        }
        else {
            return res.status(404).json({message: "Testimonial not found"});    
        }
    }
}