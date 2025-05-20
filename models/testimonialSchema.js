import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    testimonials:[
        {
            name: {
                type: String,
                required: true,
            },
            designation: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;