"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTestStore } from "@/stores/testStore"
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

export function RecentTests() {
  const { tests, isLoading, fetchTests } = useTestStore()
  const [recentTests, setRecentTests] = useState<any[]>([])

  useEffect(() => {
    fetchTests()
  }, [fetchTests])

  useEffect(() => {
    const today = new Date()
    const past30Days = new Date(today.setDate(today.getDate() - 30))

    const filtered = tests
      .filter((test) => new Date(test.date) >= past30Days)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setRecentTests(filtered)
  }, [tests])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tests</CardTitle>
        <CardDescription>
          Your tests from the past 30 days
        </CardDescription>
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

            <div className=" mt-36  text-center">
              <Button asChild variant="link" className="text-curex">
                <Link href="/user/$%7BuserId%7D/dashboard/tests">View all tests</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
