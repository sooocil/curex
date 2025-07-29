import { NextRequest, NextResponse } from "next/server";
import { ChatMessage } from "@/models/consultations/ChatMessage";
import { connectDB } from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest, { params }: { params: { consultationId: string } }) {
  await connectDB();

  try {
    const messages = await ChatMessage.find({ consultationId: params.consultationId }).sort({ timestamp: 1 });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { consultationId: string } }) {
  await connectDB();

  const { senderId, senderRole, message } = await req.json();

  if (!senderId || !senderRole || !message) {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }

  try {
    const newMsg = await ChatMessage.create({
      consultationId: params.consultationId,
      senderId,
      senderRole,
      message,
    });
    return NextResponse.json({ success: true, message: newMsg });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
