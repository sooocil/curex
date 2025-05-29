import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import doctorApplicationModel from "@/models/doctor/doctorapplications";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const date = searchParams.get("date") || "";

    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (date && date !== "all") {
      const now = new Date();
      let startDate: Date;
      switch (date) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "this_week":
          startDate = new Date(now.setDate(now.getDate() - now.getDay()));
          startDate.setHours(0, 0, 0, 0);
          break;
        case "this_month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }
      query.createdAt = { $gte: startDate };
    }

    const applications = await doctorApplicationModel.find(query).lean();

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