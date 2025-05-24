// src/app/api/tests/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({ tests: [], success: true }, { status: 200 });
}