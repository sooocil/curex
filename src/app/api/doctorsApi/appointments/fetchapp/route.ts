import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/dbConfig/dbConfig";
import Appointment from "@/models/appointments";
import User from "@/models/userModel";
import Doctor from "@/models/doctor/doctorModel";

mongoose.model("user", User.schema);
mongoose.model("doctors", Doctor.schema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    console.log("Connected to MongoDB. Models registered:", mongoose.modelNames());

    const { doctorId } = await req.json();
    console.log("Received doctorId:", doctorId);

    if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
      console.warn("Invalid or missing doctorId:", doctorId);
      return NextResponse.json({ message: "Invalid doctor ID" }, { status: 400 });
    }

    const appointments = await Appointment.find({ doctor: doctorId })
      .populate({ path: "user", model: "user", select: "username email status mode" })
      .populate({ path: "doctor", model: "doctors", select: "name specialty rate" })
      .lean()
      .exec();

    if (!appointments || appointments.length === 0) {
      console.log("No appointments found for doctorId:", doctorId);
      return NextResponse.json({ message: "No appointments found" }, { status: 404 });
    }

    console.log("Fetched doctor appointments:", appointments);
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 });
  }
}
