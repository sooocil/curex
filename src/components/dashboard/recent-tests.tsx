"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Test {
  id: string
  name: string
  date: string
  result: "Normal" | "Low" | "High"
}

export function RecentTests() {
  const [isLoading, setIsLoading] = useState(true)
  const [tests, setTests] = useState<Test[]>([])

  // Simulate loading and set dummy test data
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date()
      const dummyTests: Test[] = [
        {
          id: "1",
          name: "Blood Glucose",
          date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          result: "Normal",
        },
        {
          id: "2",
          name: "Cholesterol",
          date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          result: "High",
        },
        {
          id: "3",
          name: "Hemoglobin",
          date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          result: "Low",
        },
      ]
      setTests(dummyTests)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const recentTests = useMemo(() => {
    const now = new Date()
    const last30Days = new Date()
    last30Days.setDate(now.getDate() - 30)

    return tests.filter((test) => {
      const testDate = new Date(test.date)
      return testDate >= last30Days && testDate <= now
    })
  }, [tests])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tests</CardTitle>
        <CardDescription>Your tests from the past 30 days</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {recentTests.length > 0 ? (
                recentTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{test.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {test.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          test.result === "Normal"
                            ? "bg-green-500"
                            : test.result === "Low"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      >
                        {test.result}
                      </Badge>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/tests/${test.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-md">
                  No tests in the last 30 days.
                </p>
              )}
            </div>

            <div className="mt-36 text-center">
              <Button asChild variant="link" className="text-curex">
                <Link href="/user/123/dashboard/tests">View all tests</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
