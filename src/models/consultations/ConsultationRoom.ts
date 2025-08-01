import mongoose from "mongoose";

const ConsultationRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    default: () => `RM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
  consultationType: { type: String, enum: ["Video Call", "Phone Call"], required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ["ready", "in-progress", "ended"], default: "ready" },
});

export const ConsultationRoom = mongoose.models?.ConsultationRoom
  || mongoose.model("ConsultationRoom", ConsultationRoomSchema);
