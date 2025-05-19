import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return null;
    }
    const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET as string);
    return decodedToken.id ;
  } catch (error:any) {
    throw new Error(error.message);
  }
};
