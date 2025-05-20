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