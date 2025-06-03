
import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Appointment from "@/models/appointments";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { userId, doctorId, date, time, reason } = await request.json();

    console.log("Received payload:", { userId, doctorId, date, time, reason });

    // Validate required fields
    if (!userId || !doctorId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: userId, doctorId, date, and time are required" },
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

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });
    }

    // Validate time format
    if (!/^([0-1]?[0-9]):([0-5][0-9]) (AM|PM)$/.test(time)) {
      return NextResponse.json(
        { error: "Invalid time format. Use hh:mm AM/PM (e.g., 09:45 AM)" },
        { status: 400 }
      );
    }


    // Validate that appointment is not in the past
    const now = new Date();
    const selectedDateTimeStr = `${date} ${time}`;
    const selectedDateTime = new Date(selectedDateTimeStr);
    if (isNaN(selectedDateTime.getTime()) || selectedDateTime < now) {
      return NextResponse.json(
        { error: "Cannot book appointment in the past" },
        { status: 400 }
      );
    }


    // Create appointment
    const appointment = new Appointment({
      user: new mongoose.Types.ObjectId(userId),
      doctor: new mongoose.Types.ObjectId(doctorId),
      date: parsedDate,
      time: time, // Assuming time is always in "hh:mm AM/PM" format
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