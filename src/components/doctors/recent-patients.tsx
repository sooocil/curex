import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentPatients = [
  {
    id: 1,
    name: "Alice Cooper",
    lastVisit: "2 days ago",
    condition: "Hypertension",
    status: "stable",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Bob Wilson",
    lastVisit: "1 week ago",
    condition: "Diabetes",
    status: "monitoring",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Carol Martinez",
    lastVisit: "3 days ago",
    condition: "Asthma",
    status: "improved",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "David Lee",
    lastVisit: "5 days ago",
    condition: "Migraine",
    status: "stable",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function RecentPatients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPatients.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                  <AvatarFallback>
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{patient.name}</p>
                  <p className="text-xs text-gray-500">{patient.condition}</p>
                  <p className="text-xs text-gray-400">{patient.lastVisit}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    patient.status === "stable"
                      ? "secondary"
                      : patient.status === "improved"
                        ? "default"
                        : "destructive"
                  }
                  className="text-xs"
                >
                  {patient.status}
                </Badge>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
