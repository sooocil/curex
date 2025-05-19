// lib/models/symptom.ts
import mongoose from "mongoose";

const SymptomSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    q1: String,
    q2: String,
    q3: String,
    q4: Number,
    q5: String,
    q6: String,
    q7: Number,
    q8: String,
    q9: String,
    q10: String,
  },
  { timestamps: true }
);

export default mongoose.models.Symptom ||
  mongoose.model("Symptom", SymptomSchema);
