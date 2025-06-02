import { connectDB } from "@/dbConfig/dbConfig";
import doctorModel from "@/models/doctor/doctorModel";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { email, password } = await req.json();

    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return NextResponse.json(
        {
          message: "Account not approved yet. Please wait for admin approval.",
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Create response and set cookies
    const response = NextResponse.json({
      message: "Login successful",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
      },
    });

    // Set token cookie (HttpOnly for security)
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Set user id cookie
    response.cookies.set("user", doctor._id.toString(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Set role cookie
    response.cookies.set("role", "doctor", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
