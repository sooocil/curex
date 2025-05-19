import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";

import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDB();

export async function GET(request: NextRequest) {
  //extract data from token
  const userId = await getDataFromToken(request);

  const user = await User.findById({ _id: userId }).select(
    "-password -username"
  );

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (user) {
    return NextResponse.json(
      { message: "User Found!", data: user },
      { status: 200 }
    );
  }
}
