import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  consultationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderRole: "doctor" | "patient";
  message: string;
  timestamp: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  consultationId: { type: Schema.Types.ObjectId, ref: "ActiveConsultation", required: true },
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["doctor", "patient"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
