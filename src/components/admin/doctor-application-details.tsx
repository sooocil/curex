"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorVerificationActions } from "@/components/admin/doctor-verification-actions";

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface Document {
  name: string;
  status: string;
}

interface DoctorApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  hospital: string;
  location: string;
  rate: number;
  availability: string;
  bio: string;
  education: Education[];
  certifications: Certification[];
  documents: Document[];
  status: string;
  createdAt: string;
}

export function DoctorApplicationDetails({ id }: { id: string }) {
  const router = useRouter();
  const [application, setApplication] = useState<DoctorApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Invalid application ID",
          variant: "destructive",
        });
        router.push("/admin/doctor-applications");
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`/api/doctorsApi/docapplications/fetchsingledoc?id=${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch application");
        }
        const data = await res.json();
        console.log("API Response:", data); // Debug log
        const app = data.application || {};
        if (!app.name) {
          console.warn("Missing name in application data:", app);
        }
        setApplication({
          id: app._id?.toString() || app.id || "",
          name: app.name || "Unknown Doctor",
          email: app.email || "",
          phone: app.phone || "",
          specialty: app.specialty || "",
          hospital: app.hospital || "",
          location: app.location || "",
          rate: app.rate || 0,
          availability: app.availability || "",
          bio: app.bio || "",
          education: Array.isArray(app.education) ? app.education : [],
          certifications: Array.isArray(app.certifications) ? app.certifications : [],
          documents: Array.isArray(app.documents) ? app.documents : [],
          status: app.status || "pending",
          createdAt: app.createdAt || "",
        });
      } catch (error) {
        console.error("Fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load application details",
          variant: "destructive",
        });
        router.push("/admin/doctor-applications");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplication();
  }, [id, router]);

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status || "Unknown"}</Badge>;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return <div>No application found.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-curex/10 text-curex text-xl">
                {application.name
                  ? application.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "N/A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{application.name}</CardTitle>
              <CardDescription>{application.specialty || "N/A"}</CardDescription>
              <div className="flex items-center mt-1 space-x-2">
                <Badge className="bg-curex">{application.hospital || "N/A"}</Badge>
                <Badge variant="outline">{application.location || "N/A"}</Badge>
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
                <p>{application.email || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Phone</h3>
                <p>{application.phone || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Rate</h3>
                <p>{application.rate ? `$${application.rate} per minute` : "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Availability</h3>
                <p>{application.availability || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Bio</h3>
                <p className="text-sm">{application.bio || "N/A"}</p>
              </div>
            </TabsContent>
            <TabsContent value="education" className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Education</h3>
                <div className="space-y-3">
                  {application.education.length > 0 ? (
                    application.education.map((edu, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <p className="font-medium">{edu.degree || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">
                          {edu.institution || "N/A"}, {edu.year || "N/A"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No education details available</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Certifications</h3>
                <div className="space-y-3">
                  {application.certifications.length > 0 ? (
                    application.certifications.map((cert, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <p className="font-medium">{cert.name || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer || "N/A"}, {cert.year || "N/A"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No certifications available</p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="documents" className="space-y-4">
              <div className="space-y-3">
                {application.documents.length > 0 ? (
                  application.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <p className="font-medium">{doc.name || "N/A"}</p>
                      </div>
                      <div>{getDocumentStatusBadge(doc.status || "unknown")}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No documents available</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-6">
            <DoctorVerificationActions id={application.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}