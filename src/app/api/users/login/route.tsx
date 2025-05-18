
import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    //validation
    console.log(reqBody);

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    console.log("User found", user);

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Check Your Credentials" },
        { status: 400 }
      );
    }
    console.log("Valid password");

    const tokenData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    const token =  jwt.sign(tokenData, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const response = NextResponse.json(
      { message: "Login Successful", userId: user._id },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;


} catch (error: String | any) {
    console.error("Error in login:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
