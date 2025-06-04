// The schema enum expects lowercase values like "online" not "Online".
// Fix: Force lowercase before saving to DB.

import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import Appointment from "@/models/appointments";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { userId, doctorId, date, time, reason, mode } = await request.json();

    console.log("Received payload:", { userId, doctorId, date, time, reason, mode });

    if (!userId || !doctorId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: userId, doctorId, date, and time are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json({ error: "Invalid doctorId format" }, { status: 400 });
    }

    if (!/^([0-1]?[0-9]):([0-5][0-9]) (AM|PM)$/.test(time)) {
      return NextResponse.json(
        { error: "Invalid time format. Use hh:mm AM/PM (e.g., 09:45 AM)" },
        { status: 400 }
      );
    }

    const selectedDateTime = new Date(`${date} ${time}`);
    if (isNaN(selectedDateTime.getTime()) || selectedDateTime < new Date()) {
      return NextResponse.json(
        { error: "Cannot book appointment in the past" },
        { status: 400 }
      );
    }

    const allowedModes = ["online", "in-person"];
    const finalMode = allowedModes.includes(mode?.toLowerCase()) ? mode.toLowerCase() : "online";

    const existing = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      time,
    });

    if (existing) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    const appointment = await Appointment.create({
      user: new mongoose.Types.ObjectId(userId),
      doctor: new mongoose.Types.ObjectId(doctorId),
      date: new Date(date),
      time,
      reason: reason || "No reason provided",
      mode: finalMode,
      status: "pending",
    });

    return NextResponse.json(
      { message: "Appointment booked successfully", appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
