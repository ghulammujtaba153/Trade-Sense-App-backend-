import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    primaryImage: {
        type: String,
        required: true
    },
    secondaryImage: {
        type: String,
        required: true
    }
})

const About = mongoose.model('About', aboutSchema);

export default About;