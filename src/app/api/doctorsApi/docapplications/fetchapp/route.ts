import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import doctorApplicationModel from "@/models/doctor/doctorapplications";

export async function GET() {
  try {
    await connectDB();
    const applications = await doctorApplicationModel.find({}).lean();
    
    if (!applications || applications.length === 0) {
      return NextResponse.json({ error: "No doctor applications found" }, { status: 404 });
    }

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching doctor applications:", error);
    return NextResponse.json({ error: "Failed to fetch doctor applications" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    const application = await doctorApplicationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating application status:", error);
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 });
  }
}