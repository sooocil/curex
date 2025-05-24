import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const recentTests = [
  {
    id: "test-1",
    name: "Complete Blood Count",
    date: "2023-04-15",
    status: "completed",
    result: "Normal",
  },
  {
    id: "test-2",
    name: "Lipid Panel",
    date: "2023-04-10",
    status: "completed",
    result: "Abnormal",
  },
  {
    id: "test-3",
    name: "Thyroid Function",
    date: "2023-03-28",
    status: "completed",
    result: "Normal",
  },
  {
    id: "test-4",
    name: "Vitamin D",
    date: "2023-03-15",
    status: "completed",
    result: "Low",
  },
]

const filteredTests = recentTests.filter((test) => test.status === "completed")
const sortedTests = filteredTests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())


export function RecentTests(test = sortedTests) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tests</CardTitle>
        <CardDescription>Your most recent medical tests and results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTests.map((test) => (
            <div key={test.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{test.name}</p>
                <p className="text-sm text-muted-foreground">{test.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  className={
                    test.result === "Normal" ? "bg-green-500" : test.result === "Low" ? "bg-yellow-500" : "bg-red-500"
                  }
                >
                  {test.result}
                </Badge>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/tests/${test.id}`}>View</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="link" className="text-curex">
            <Link href="/user/${userId}/dashboard/tests">View all tests</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
