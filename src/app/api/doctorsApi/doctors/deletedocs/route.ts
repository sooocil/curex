import { NextRequest, NextResponse } from "next/server";
import doctorModel from "@/models/doctor/doctorModel";
import { isValidObjectId } from "mongoose";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid or missing doctor ID" },
        { status: 400 }
      );
    }

    const deletedDoctor = await doctorModel.findByIdAndDelete(id);
    if (!deletedDoctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { error: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}