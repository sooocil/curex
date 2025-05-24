import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const scheduleItems = [
  { time: "09:00 - 10:00", status: "busy", patient: "John Smith" },
  { time: "10:30 - 11:30", status: "busy", patient: "Emily Johnson" },
  { time: "11:30 - 12:30", status: "free" },
  { time: "14:00 - 15:00", status: "busy", patient: "Michael Brown" },
  { time: "15:30 - 16:30", status: "busy", patient: "Sarah Davis" },
  { time: "16:30 - 17:30", status: "free" },
]

export function ScheduleOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scheduleItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">{item.time}</p>
                {item.patient && <p className="text-xs text-gray-500">{item.patient}</p>}
              </div>
              <Badge variant={item.status === "busy" ? "destructive" : "secondary"}>
                {item.status === "busy" ? "Busy" : "Free"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
