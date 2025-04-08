"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for a single application
const applicationData = {
  id: "app-1",
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@example.com",
  specialty: "Cardiologist",
  hospital: "City General Hospital",
  location: "New York, NY",
  rate: 120,
  availability: "Mon, Wed, Fri: 9AM-5PM",
  bio: "Dr. Sarah Johnson is a board-certified cardiologist with over 10 years of experience in treating heart conditions. She specializes in preventive cardiology and heart failure management.",
  education: [
    {
      degree: "MD",
      institution: "Harvard Medical School",
      year: "2008",
    },
    {
      degree: "Residency in Internal Medicine",
      institution: "Massachusetts General Hospital",
      year: "2011",
    },
    {
      degree: "Fellowship in Cardiology",
      institution: "Johns Hopkins Hospital",
      year: "2014",
    },
  ],
  certifications: [
    {
      name: "Board Certification in Cardiology",
      issuer: "American Board of Internal Medicine",
      year: "2015",
    },
    {
      name: "Advanced Cardiac Life Support (ACLS)",
      issuer: "American Heart Association",
      year: "2022",
    },
  ],
  documents: [
    {
      name: "Medical License",
      status: "verified",
    },
    {
      name: "Board Certification",
      status: "verified",
    },
    {
      name: "Hospital Privileges",
      status: "pending",
    },
  ],
  status: "pending",
  dateApplied: "2023-04-08",
}

export function DoctorApplicationDetails({ id }: { id: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(applicationData.status)

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)

    try {
      // This would be replaced with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStatus(newStatus)
      toast({
        title: "Status updated",
        description: `Application has been ${newStatus}.`,
      })

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/doctor-applications")
      }, 1500)
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "The status could not be updated. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-curex/10 text-curex text-xl">
                {applicationData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{applicationData.name}</CardTitle>
              <CardDescription>{applicationData.specialty}</CardDescription>
              <div className="flex items-center mt-1 space-x-2">
                <Badge className="bg-curex">{applicationData.hospital}</Badge>
                <Badge variant="outline">{applicationData.location}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="education">Education & Certifications</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
                <p>{applicationData.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Rate</h3>
                <p>${applicationData.rate} per minute</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Availability</h3>
                <p>{applicationData.availability}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Bio</h3>
                <p className="text-sm">{applicationData.bio}</p>
              </div>
            </TabsContent>
            <TabsContent value="education" className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Education</h3>
                <div className="space-y-3">
                  {applicationData.education.map((edu, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.institution}, {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Certifications</h3>
                <div className="space-y-3">
                  {applicationData.certifications.map((cert, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer}, {cert.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="documents" className="space-y-4">
              <div className="space-y-3">
                {applicationData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between border rounded-md p-3">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                    </div>
                    <div>{getDocumentStatusBadge(doc.status)}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
