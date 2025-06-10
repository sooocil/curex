// src/app/api/users/login/route.ts
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log("Login request body:", reqBody);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    console.log("User found:", user._id, user.name);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password for user:", email);
      return NextResponse.json(
        { message: "Check Your Credentials" },
        { status: 400 }
      );
    }
    console.log("Password validated for user:", user._id);

    interface TokenData {
      id: string;
      name: string;
      email: string;
    }

    const tokenData: TokenData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      throw new Error("Server configuration error");
    }

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("JWT token generated for user:", user._id);

    // Create user data for cookie
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    const response = NextResponse.json(
      {
        message: "Login Successful",
        userId: user._id,
        token,
        user: userData,
      },
      { status: 200 }
    );
    (await cookies()).set("token", token, {
      httpOnly: false,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    });

    (await cookies()).set("user", encodeURIComponent(JSON.stringify(userData)), {
      httpOnly: false,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
            expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days

    });

    console.log("Cookies set: token, user for user:", user._id);
    console.log("Token value:", token);
    console.log("User data:", userData);
    return response;
  } catch (error: any) {
    console.error("Error in login:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
