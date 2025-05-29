import { NextRequest, NextResponse } from 'next/server';

// Mock function to reject a doctor application in your database
async function rejectDoctorApplication(applicationId: string, reason?: string) {
  // Replace this with your actual DB logic
  // Example: await db.doctorApplications.update({ id: applicationId }, { status: 'rejected', rejectionReason: reason });
  return { success: true };
}

export async function POST(req: NextRequest) {
  try {
    const { applicationId, reason } = await req.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID is required.' }, { status: 400 });
    }

    const result = await rejectDoctorApplication(applicationId, reason);

    if (result.success) {
      return NextResponse.json({ message: 'Application rejected successfully.' });
    } else {
      return NextResponse.json({ error: 'Failed to reject application.' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}