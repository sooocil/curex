import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PatientStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>New Patients</span>
            <span>24/30</span>
          </div>
          <Progress value={80} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Follow-up Visits</span>
            <span>18/25</span>
          </div>
          <Progress value={72} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Emergency Cases</span>
            <span>3/10</span>
          </div>
          <Progress value={30} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Consultations</span>
            <span>45/50</span>
          </div>
          <Progress value={90} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
