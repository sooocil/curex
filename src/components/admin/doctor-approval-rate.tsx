import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DoctorApprovalRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Rate</CardTitle>
        <CardDescription>Doctor application approval statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>Approved</div>
            <div className="font-medium">78%</div>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-green-500 w-[78%]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>Rejected</div>
            <div className="font-medium">15%</div>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-red-500 w-[15%]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>Pending Additional Info</div>
            <div className="font-medium">7%</div>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-yellow-500 w-[7%]" />
          </div>
        </div>
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-500">156</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">30</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">14</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
