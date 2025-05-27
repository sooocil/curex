"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast"; // Import toast for local error handling
import { useState } from "react";

interface ReviewStepProps {
  formData: any;
  onSubmit: () => Promise<void>;
  onPrev: () => void;
  isSubmitting: boolean; // Use prop instead of local state
}

export function ReviewStep({ formData, onSubmit, onPrev, isSubmitting }: ReviewStepProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async () => {
    if (!termsAccepted) {
      toast({
        title: "Terms Not Accepted",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    await onSubmit(); // Call the passed onSubmit function
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Your Information</h2>
        <p className="text-sm text-gray-500">Please review your information before submitting</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="grid grid-cols-3">
              <span className="text-sm font-medium text-gray-500">Name</span>
              <span className="col-span-2">{formData.name}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="col-span-2">{formData.email}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-sm font-medium text-gray-500">Phone</span>
              <span className="col-span-2">{formData.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="grid grid-cols-3">
              <span className="text-sm font-medium text-gray-500">Specialty</span>
              <span className="col-span-2">{formData.specialty}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-sm font-medium text-gray-500">Hospital/Clinic</span>
              <span className="col-span-2">{formData.hospital}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-sm font-medium text-gray-500">Location</span>
              <span className="col-span-2">{formData.location}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-sm font-medium text-gray-500">Rate</span>
              <span className="col-span-2">${formData.rate} per minute</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-sm font-medium text-gray-500">Availability</span>
              <span className="col-span-2">{formData.availability}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-sm font-medium text-gray-500">Bio</span>
              <span className="col-span-2">{formData.bio}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formData.education.map((edu: any, index: number) => (
              <div key={index} className="p-2 border rounded-md">
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-gray-600">
                  {edu.institution}, {edu.year}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formData.certifications.map((cert: any, index: number) => (
              <div key={index} className="p-2 border rounded-md">
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-gray-600">
                  {cert.issuer}, {cert.year}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center p-2 border rounded-md">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Medical License</span>
              <span className="ml-auto text-xs text-gray-500">
                {formData.documents.medicalLicense?.name} (
                {(formData.documents.medicalLicense?.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <div className="flex items-center p-2 border rounded-md">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>Board Certification</span>
              <span className="ml-auto text-xs text-gray-500">
                {formData.documents.boardCertification?.name} (
                {(formData.documents.boardCertification?.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <div className="flex items-center p-2 border rounded-md">
              <span>
                Hospital Privileges{" "}
                {formData.documents.hospitalPrivileges ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 inline" />
                    <span className="ml-auto text-xs text-gray-500">
                      {formData.documents.hospitalPrivileges?.name} (
                      {(formData.documents.hospitalPrivileges?.size / 1024).toFixed(2)} KB)
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-500">(Not uploaded)</span>
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start space-x-2 py-4">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(!!checked)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="terms"
            className="text-md font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm that all information provided is accurate and complete
          </Label>
          <p className="text-sm text-muted-foreground">
            By submitting this application, I agree to the terms of service and privacy policy.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          type="button"
          className="bg-curex hover:bg-curex-dark text-white"
          onClick={handleSubmit}
          disabled={!termsAccepted || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </div>
  );
}