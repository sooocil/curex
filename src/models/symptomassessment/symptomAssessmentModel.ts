import mongoose from "mongoose";

const symptomAssessmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "user", // Match your actual User model name (lowercase)
    required: true 
  },
  username: { 
    type: String, 
    required: false,
  },
  mainSymptom: { type: String, required: false },
  duration: { type: String, required: false },
  hasFever: { type: String, required: false },
  temperature: { type: Number, required: false, default: 98.6 },
  hasCough: { type: String, required: false },
  coughType: { type: String, required: false },
  painLevel: { type: Number, required: false, default: 0 },
  hasFatigue: { type: String, required: false },
  contactWithSick: { type: String, required: false },
  otherSymptoms: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});



export default mongoose.models.SymptomAssessment ||
  mongoose.model("SymptomAssessment", symptomAssessmentSchema);