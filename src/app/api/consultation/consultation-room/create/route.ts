import { NextResponse } from "next/server";
import { ConsultationRoom } from "@/models/consultations/ConsultationRoom";
import { connectDB } from "@/dbConfig/dbConfig";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { doctorId, patientId, patientName } = body;

    if (!doctorId || !patientId || !patientName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const roomCode = `RM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const newRoom = await ConsultationRoom.create({
      doctorId,
      patientId,
      patientName,
      status: "waiting",
      startTime: new Date(),
      roomCode,
    });

    return NextResponse.json({ room: newRoom });
  } catch (error) {
    console.error("Failed to create consultation room:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
