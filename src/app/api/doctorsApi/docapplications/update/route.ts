import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import doctorapplications from '@/models/doctor/doctorapplications';

export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const id = body?.id;
    const status = body?.status;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    console.log("Looking for id:", id, "to set status:", status);

    const application = await doctorapplications.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: 'Failed to update application status' }, { status: 500 });
  }
}
