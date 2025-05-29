  import { NextRequest, NextResponse } from 'next/server';
  import { connectDB } from '@/dbConfig/dbConfig';
  import doctorapplications from '@/models/doctor/doctorapplications';

  export async function PATCH(req: NextRequest) {
    await connectDB();

    try {
      const { id, status } = await req.json();

      if (!id || !status) {
        return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
      }

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
      return NextResponse.json({ error: 'Failed to update application status' }, { status: 500 });
    }
  }