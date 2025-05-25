// app/api/doctors/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const doctors = [
    {
      id: "doc-1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      contact: "123-456-7890",
      rate: 50,
      rating: 4.5,
      reviews: 120,
      hospital: "Chitwan Multiple Campus",
      location: "Downtown",
      availability: "Mon-Fri, 9 AM - 5 PM",
    },
    {
      id: "doc-2",
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      contact: "987-654-3210",
      rate: 50,
      rating: 4.5,
      reviews: 120,
      hospital: "Tandi Hospital",
      location: "Downtown",
      availability: "Mon-Fri, 9 AM - 5 PM",
    },
  ];

  return NextResponse.json(doctors);
}
