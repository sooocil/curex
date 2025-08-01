import { NextRequest, NextResponse } from "next/server";
import { ConsultationRoom } from "@/models/consultations/ConsultationRoom";
import { connectDB } from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {

  await connectDB();

  const rooms = await ConsultationRoom.find({ patientId: params.userId }).populate("doctorId").lean();

  return NextResponse.json(rooms);
}
