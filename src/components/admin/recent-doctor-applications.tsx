import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const recentApplications = [
  {
    id: "app-1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    hospital: "City General Hospital",
    date: "2023-04-08",
    status: "pending",
  },
  {
    id: "app-2",
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    hospital: "Westside Medical Center",
    date: "2023-04-07",
    status: "pending",
  },
  {
    id: "app-3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    hospital: "Children's Hospital",
    date: "2023-04-06",
    status: "pending",
  },
  {
    id: "app-4",
    name: "Dr. James Wilson",
    specialty: "Neurologist",
    hospital: "University Medical Center",
    date: "2023-04-05",
    status: "pending",
  },
]

export function RecentDoctorApplications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>You have {recentApplications.length} pending applications to review.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentApplications.map((application) => (
            <div key={application.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-curex/10 text-curex">
                    {application.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{application.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {application.specialty} • {application.hospital}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/admin/doctor-applications/${application.id}`}>Review</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="link" className="text-curex">
            <Link href="/dashboard/admin/doctor-applications">View all applications</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
