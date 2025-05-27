import doctorSchema from "@/models/doctor/doctorModel";
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const doctorData = new doctorSchema(body);
    const savedDoctor = await doctorData.save();
    return NextResponse.json(
      { message: "Doctor registered successfully", data: savedDoctor },
      { status: 201 }
    );
  } catch (error) {
    console.error("Doctor registration failed due to :", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
