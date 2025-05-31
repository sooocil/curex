"use client";

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDocApplicationStore } from "@/stores/doctorStores/docApplicationStore"



export function RecentDoctorApplications() {
  const recentApplications = useDocApplicationStore((state) => state.applications)

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
                <Link href={`/admin/doctor-applications/${application.id}`}>Review</Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="link" className="text-curex">
            <Link href="/admin/doctor-applications">View all applications</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
