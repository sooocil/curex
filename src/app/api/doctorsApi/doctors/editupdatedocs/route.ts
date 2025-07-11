import { NextRequest, NextResponse } from 'next/server';

// Example handler for updating doctor information
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    // TODO: Update doctor logic here

    return NextResponse.json({ message: 'Doctor updated successfully', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}