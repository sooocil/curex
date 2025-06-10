import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/dbConfig/dbConfig";
import Appointment from "@/models/appointments";
import User from "@/models/userModel"; // Import User model
import Doctor from "@/models/doctor/doctorModel"; // Import Doctor model

// Ensure models are registered
mongoose.model("users", User.schema);
mongoose.model("doctors", Doctor.schema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    console.log("Connected to MongoDB. Models registered:", mongoose.modelNames());

    const { userId } = await req.json();
    console.log("Received userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.warn("Invalid userId format:", userId);
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const appointments = await Appointment.find({ user: userId })
      .populate({ path: "user", model: "users", select: "username email" })
      .populate({ path: "doctor", model: "doctors", select: "name specialty rate" })
      .lean() // Convert to plain JavaScript objects to avoid Mongoose overhead
      .exec();

    console.log("Fetched appointments:", JSON.stringify(appointments, null, 2));

    if (!appointments || appointments.length === 0) {
      console.log("No appointments found for userId:", userId);
      return NextResponse.json({ message: "No appointments found" }, { status: 201 });
    }

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 });
  }
}
