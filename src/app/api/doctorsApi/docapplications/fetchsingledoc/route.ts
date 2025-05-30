import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import doctorapplications from "@/models/doctor/doctorapplications";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
    }

    await connectDB();

    const application = await doctorapplications.findById(id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({
      application: {
        ...application.toObject(),
        id: application._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}