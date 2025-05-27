import { NextResponse, NextRequest } from "next/server";
import doctorApplicationModel from "@/models/doctor/doctorapplications";

export async function GET() {
  try {
    const applications = await doctorApplicationModel.find({});
    return NextResponse.json({ applications }, { status: 200 });
    console.log("Doctor applications fetched successfully", applications);
  } catch (error) {
    console.error("Error fetching doctor applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor applications" },
      { status: 500 }
    );
  }
}
