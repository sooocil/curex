import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/dbConfig/dbConfig";
import Appointment from "@/models/appointments";
import User from "@/models/userModel";
import Doctor from "@/models/doctor/doctorModel";

//route to delete an appointment
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { appointmentId } = await req.json();

    // Check if the appointment exists
    const appointment = await Appointment.findById(appointmentId)
      .populate({ path: "user", model: "user", select: "username email" })
      .populate({ path: "doctor", model: "doctors", select: "name specialty rate" })
      .lean()
      .exec();    
    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    } 
    // Delete the appointment
    await Appointment.findByIdAndDelete(appointmentId);
    return NextResponse.json({ message: "Appointment deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 });
  }
}