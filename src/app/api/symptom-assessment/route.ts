// app/api/symptom-assessment/route.ts
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import Symptom from "@/models/symptom";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, ...answers } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    await connectDB();

    const saved = await Symptom.create({ userId, ...answers });

    return NextResponse.json(
      { message: "Symptom saved successfully", data: saved },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error saving symptom:", err);
    return NextResponse.json(
      { error: "Failed to save symptom data" },
      { status: 500 }
    );
  }
}
