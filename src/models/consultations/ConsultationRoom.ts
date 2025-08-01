import mongoose, { Schema, Document } from "mongoose";

export interface IConsultationRoom extends Document {
  roomId: string;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: "ready" | "in-progress" | "ended";
  consultationType: "Video Call" | "Phone Call";
  appointmentId: mongoose.Types.ObjectId;
}

const ConsultationRoomSchema = new Schema<IConsultationRoom>({
  roomId: { type: String, required: true, unique: true },
  patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
  consultationType: { type: String, enum: ["Video Call", "Phone Call"], required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ["ready", "in-progress", "ended"], default: "ready" },
});

export const ConsultationRoom = mongoose.models.ConsultationRoom || mongoose.model("ConsultationRoom", ConsultationRoomSchema);
