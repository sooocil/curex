import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatientStats extends Document {
  userId: string;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  bloodGlucose: number;
}

const PatientStatsSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  heartRate: { type: Number, required: true, default: 72 },
  bloodPressure: { type: String, required: true, default: "120/80" },
  temperature: { type: Number, required: true, default: 98.6 },
  bloodGlucose: { type: Number, required: true, default: 95 },
});

const PatientStats: Model<IPatientStats> =
  mongoose.models.PatientStats || mongoose.model("PatientStats", PatientStatsSchema);

export default PatientStats;
