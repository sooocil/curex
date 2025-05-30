import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import doctorapplications from "@/models/doctor/doctorapplications";

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    await connectDB();

    const updated = await doctorapplications.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Status updated",
      application: { ...updated.toObject(), id: updated._id.toString() },
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}