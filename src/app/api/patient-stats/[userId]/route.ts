// app/api/patient-stats/[userId]/route.ts
import { NextResponse } from "next/server";
import PatientStats from "@/models/PatientStats";
import { connectDB } from "@/dbConfig/dbConfig";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  await connectDB();

  const stats = await PatientStats.findOne({ userId });
  if (!stats) return NextResponse.json({ error: "Stats not found" }, { status: 404 });

  return NextResponse.json(stats);
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  await connectDB();

  try {
    const updates = await request.json();
    const stats = await PatientStats.findOneAndUpdate({ userId }, updates, {
      new: true,
      upsert: true,
    });
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}

export async function POST() {
  // You can implement if needed or remove this function.
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
