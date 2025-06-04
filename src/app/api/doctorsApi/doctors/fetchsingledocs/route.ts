// /app/api/doctorsApi/doctors/fetchsingledocs/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import doctorModel from "@/models/doctor/doctorModel";
import { connectDB } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  await connectDB();

  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const doctor = await doctorModel.findById(decoded.id).select("-password");

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({ doctor }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
