import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/dbConfig/dbConfig";
import Appointment from "@/models/appointments";
import User from "@/models/userModel";
import Doctor from "@/models/doctor/doctorModel";

export async function POST(req: NextRequest) {
  await connectDB();

  console.log("Models registered:", mongoose.modelNames());

  try {
    const { userId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const appointments = await Appointment.find({ user: userId })
      .populate({ path: "user", model: "users", select: "username email" }) 
      .populate({ path: "doctor", select: "name specialty rate" }) 
      .exec();

    console.log("Appointments fetched:", appointments);
    if (!appointments || appointments.length === 0) {
      return NextResponse.json(
        { message: "No appointments found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
