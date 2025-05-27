"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { RegistrationProgress } from "@/components/doctor/registration-progress";
import { BasicInfoStep } from "@/components/doctor/steps/basic-info-step";
import { ProfessionalInfoStep } from "@/components/doctor/steps/professional-info-step";
import { EducationStep } from "@/components/doctor/steps/education-step";
import { DocumentsStep } from "@/components/doctor/steps/documents-step";
import { ReviewStep } from "@/components/doctor/steps/review-step";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const steps = [
  { id: "basic-info", title: "Basic Information" },
  { id: "professional-info", title: "Professional Details" },
  { id: "education", title: "Education & Certifications" },
  { id: "documents", title: "Documents" },
  { id: "review", title: "Review & Submit" },
];

export function DoctorRegistrationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    email: "",
    password: "",
    phone: "",
    // Professional Info
    specialty: "",
    hospital: "",
    location: "",
    rate: "",
    availability: "",
    bio: "",
    // Education & Certifications
    education: [
      { degree: "MD", institution: "", year: "" },
      { degree: "Residency", institution: "", year: "" },
      { degree: "Fellowship", institution: "", year: "" },
    ],
    certifications: [
      { name: "Board Certification", issuer: "", year: "" },
      { name: "Advanced Cardiac Life Support (ACLS)", issuer: "", year: "" },
    ],
    // Documents
    documents: {
      medicalLicense: null as File | null,
      boardCertification: null as File | null,
      hospitalPrivileges: null as File | null,
    },
  });

  const updateFormData = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key !== "documents") {
          const value = formData[key as keyof typeof formData];
          if (typeof value === "string") {
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, JSON.stringify(value));
          }
        }
      }
      if (formData.documents) {
        for (const [docType, file] of Object.entries(formData.documents)) {
          if (file && file instanceof File) {
            formDataToSend.append(docType, file);
          }
        }
      }
      const response = await axios.post(
        "/api/doctorsApi/docreg",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 10000,
        }
      );
      if (response.status !== 201) {
        throw new Error(response.data.error || "Failed to register");
      }
      setTimeout(() => {
        toast({
          title: "Registration Successful",
          description: "Your doctor profile has been created successfully!",
          variant: "default",
        });
        setIsSubmitting(false);
        router.push("/doctor/registration-success");
      }, 2000);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Registration Failed",
        description:
          error.response?.data?.error ||
          error.message ||
          "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <ProfessionalInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 2:
        return (
          <EducationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <DocumentsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <RegistrationProgress steps={steps} currentStep={currentStep} />
      <Card className="p-6">{renderStep()}</Card>
    </div>
  );
}
