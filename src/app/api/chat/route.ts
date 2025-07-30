import { NextResponse } from "next/server";
import { ChatMessage } from "@/models/consultations/ChatMessage";
import { connectDB } from "@/dbConfig/dbConfig";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const message = await ChatMessage.create(body);
    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Message storing failed" }, { status: 500 });
  }
}