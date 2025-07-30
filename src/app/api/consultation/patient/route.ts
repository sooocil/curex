
import { NextResponse } from "next/server";
import { ActiveConsultation } from "@/models/consultations/consultation";
import { connectDB } from "@/dbConfig/dbConfig";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await connectDB();

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const consultations = await ActiveConsultation.find({ patientId: id }).sort({ startTime: -1 });

  return NextResponse.json(consultations);
}
