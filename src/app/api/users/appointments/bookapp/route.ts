import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Appointment from "@/models/appointments";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { userId, doctorId, date, reason } = await request.json();

    console.log("Booking appointment with IDs:", { userId, doctorId, date, reason });

    // Validate required fields
    if (!userId || !doctorId || !date) {
      return NextResponse.json(
        { error: "Missing required fields: userId, doctorId, and date are required" },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json({ error: "Invalid doctorId format" }, { status: 400 });
    }

    // Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Create appointment
    const appointment = new Appointment({
      user: new mongoose.Types.ObjectId(userId),
      doctor: new mongoose.Types.ObjectId(doctorId),
      date: parsedDate,
      reason: reason || "No reason provided",
    });

    await appointment.save();

    return NextResponse.json(
      { message: "Appointment booked successfully", appointment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error booking appointment:", error.message);
    return NextResponse.json(
      { error: "Failed to book appointment", details: error.message },
      { status: 500 }
    );
  }
}