import { Request, Response } from "express";
import { ChatMessage } from "@/models/consultations/ChatMessage";

export const storeMessage = async (req: Request, res: Response) => {
  try {
    const { consultationId, senderId, senderRole, message, timestamp } = req.body;
    const newMessage = new ChatMessage({
      consultationId,
      senderId,
      senderRole,
      message,
      timestamp: new Date(timestamp),
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to store message" });
  }
};