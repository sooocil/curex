"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const doctorsList = [
  {
    id: "doc-1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    hospital: "City General Hospital",
    location: "New York, NY",
    rating: 4.9,
    reviews: 124,
    availability: "Mon, Wed, Fri",
    rate: 120,
  },
  {
    id: "doc-2",
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    hospital: "Westside Medical Center",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviews: 98,
    availability: "Tue, Thu",
    rate: 100,
  },
  {
    id: "doc-3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    hospital: "Children's Hospital",
    location: "Chicago, IL",
    rating: 4.7,
    reviews: 156,
    availability: "Mon-Fri",
    rate: 90,
  },
  {
    id: "doc-4",
    name: "Dr. James Wilson",
    specialty: "Neurologist",
    hospital: "University Medical Center",
    location: "Boston, MA",
    rating: 4.9,
    reviews: 112,
    availability: "Wed, Fri",
    rate: 150,
  },
  {
    id: "doc-5",
    name: "Dr. Lisa Thompson",
    specialty: "Oncologist",
    hospital: "Cancer Treatment Center",
    location: "Houston, TX",
    rating: 4.8,
    reviews: 87,
    availability: "Mon, Thu",
    rate: 130,
  },
  {
    id: "doc-6",
    name: "Dr. Robert Garcia",
    specialty: "Orthopedic Surgeon",
    hospital: "Sports Medicine Clinic",
    location: "Miami, FL",
    rating: 4.6,
    reviews: 92,
    availability: "Tue, Thu, Sat",
    rate: 140,
  },
]

export const DoctorsList = () => {
  const [doctors] = useState(doctorsList)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-curex/10 text-curex">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                  </div>
                </div>
                <Badge className="bg-curex">${doctor.rate}/min</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="flex items-center text-yellow-400 mr-1">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <span className="font-medium">{doctor.rating}</span>
                  <span className="text-muted-foreground ml-1">({doctor.reviews} reviews)</span>
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Hospital:</span> {doctor.hospital}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Location:</span> {doctor.location}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Available:</span> {doctor.availability}
                </p>
              </div>
            </div>
            <div className="flex border-t">
              <Button className="flex-1 rounded-none bg-white text-curex hover:bg-gray-50 hover:text-curex-dark">
                View Profile
              </Button>
              <Button className="flex-1 rounded-none bg-curex hover:bg-curex-dark text-white">Book Appointment</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
