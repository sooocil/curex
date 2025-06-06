import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import Appointment from "@/models/appointments";


export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

     await connectDB();

    // Find appointments by userId and status "approved"
    const appointments = await Appointment
      .find({
        "user._id": userId,
        status: "approved",
      });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}