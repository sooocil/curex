import { NextRequest, NextResponse } from "next/server";
import PatientStats from "@/models/PatientStats";
import { connectDB } from "@/dbConfig/dbConfig";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  await connectDB();

  const stats = await PatientStats.findOne({ userId });
  if (!stats) {
    return NextResponse.json({ error: "Stats not found" }, { status: 404 });
  }

  return NextResponse.json(stats);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  await connectDB();

  try {
    const updates = await req.json();
    const stats = await PatientStats.findOneAndUpdate(
      { userId },
      updates,
      { new: true, upsert: true }
    );
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}