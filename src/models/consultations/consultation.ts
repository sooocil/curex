import mongoose, { Schema, Document } from "mongoose";

export interface IActiveConsultation extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  patientName: string;
  patientAvatar?: string;
  type: "Video Call" | "Phone Call";
  status: "In Progress" | "Completed" | "Ended";
  startTime: Date;
  endTime?: Date;
  duration?: string; // can be computed or stored as string "mm:ss"
  notes?: string;
  // you can add fields for chatId, callRoomId, etc.
}

const ActiveConsultationSchema: Schema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  patientName: { type: String, required: true },
  patientAvatar: { type: String, default: "/placeholder.svg" },
  type: { type: String, enum: ["Video Call", "Phone Call"], required: true },
  status: { type: String, enum: ["In Progress", "Completed", "Ended"], default: "In Progress" },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: String },
  notes: { type: String },
});

export const ActiveConsultation = mongoose.model<IActiveConsultation>("ActiveConsultation", ActiveConsultationSchema);
