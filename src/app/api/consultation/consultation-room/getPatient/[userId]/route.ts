import { NextResponse } from "next/server";
import { ConsultationRoom } from "@/models/consultations/ConsultationRoom";
import { connectDB } from "@/dbConfig/dbConfig";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }



    const rooms = await ConsultationRoom.find({ patientId: userId })
      .populate("doctorId", "name specialty")
      .lean();

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Failed to fetch consultation rooms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
