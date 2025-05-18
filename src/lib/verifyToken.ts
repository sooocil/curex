import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  name: string;
  email: string;
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
