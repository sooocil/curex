import { NextRequest, NextResponse } from "next/server";
import doctorModel from "@/models/doctor/doctorModel";
import { connectDB } from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const doctors = await doctorModel
      .find({})
      .select("-__v -createdAt -updatedAt")
      .lean();

    if (!doctors || doctors.length === 0) {
      return NextResponse.json({ message: "No doctors found" }, { status: 200 });
    }

    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
