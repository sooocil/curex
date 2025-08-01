import { NextResponse } from "next/server";
import {ConsultationRoom} from "@/models/consultations/ConsultationRoom";
import { connectDB } from "@/dbConfig/dbConfig";

export async function GET(req: Request, { params }: { params: { doctorId: string } }) {
  try {
    await connectDB();

    const { doctorId } = params;

    const rooms = await ConsultationRoom.find({ doctorId, status: { $in: ["waiting", "active"] } }).lean();

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Failed to fetch consultation rooms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
