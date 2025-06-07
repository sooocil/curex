import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/dbConfig/dbConfig';
import Appointment from '@/models/appointments';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'approved' },
      { new: true }
    );

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Appointment approved', appointment });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}