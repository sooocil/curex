import { NextResponse } from "next/server";
import doctorModel from "@/models/doctor/doctorModel";

export async function GET() {

  try {
    //fetch all doctors from the database
    const doctors = await doctorModel.find({}).select("-__v -createdAt -updatedAt").lean();
    if (!doctors || doctors.length === 0) {
      return NextResponse.json({ message: "No doctors found" }, { status: 404 });
    }
    // Return the list of doctors
    return NextResponse.json(doctors, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
    
  }



}
