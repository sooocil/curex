import { NextRequest, NextResponse } from 'next/server';

// Example POST handler for adding a doctor
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // TODO: Add logic to save doctor data to database

    return NextResponse.json({ message: 'Doctor added successfully', data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add doctor' }, { status: 500 });
  }
}