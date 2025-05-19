import mongoose from "mongoose";

const illnessSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    symptoms:{
        type: [String],
        required: true
    },
    severity:{
        type: String,
        enum: ['Mild', 'Moderate', 'Severe'],
        required: true
    },
    category:{
        type: String,
        enum: ['respiratory', 'neurological','Infectious', 'Chronic', 'Genetic', 'Autoimmune', 'Other'],
        required: true
    }
})

export default mongoose.Schema('illness', illnessSchema );
