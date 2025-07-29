import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import PatientStats from "@/models/PatientStats";  
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "username, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User created:", savedUser);

    try {
      const existingStats = await PatientStats.findOne({ userId: savedUser._id });
      if (!existingStats) {
        await PatientStats.create({
          userId: savedUser._id,
          heartRate: 72,
          bloodPressure: "120/80",
          temperature: 98.6,
          bloodGlucose: 95,
        });
        console.log("Default PatientStats created for user:", savedUser._id);
      }
    } catch (statsErr) {
      console.error("Failed to create PatientStats for new user:", statsErr);
    }

    try {
      await sendEmail({
        email,
        emailType: "VERIFY",
        userId: savedUser._id,
      });
    } catch (mailErr: any) {
      console.error("Email sending error:", mailErr.message);
      return NextResponse.json(
        { message: "User created, but failed to send verification email." },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully. Verification email sent.",
        success: true,
        userId: savedUser._id,

        user: {
          username: savedUser.username,
          email: savedUser.email,
          createdAt: savedUser.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
