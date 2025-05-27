"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { RegistrationProgress } from "@/components/doctor/registration-progress"
import { BasicInfoStep } from "@/components/doctor/steps/basic-info-step"
import { ProfessionalInfoStep } from "@/components/doctor/steps/professional-info-step"
import { EducationStep } from "@/components/doctor/steps/education-step"
import { DocumentsStep } from "@/components/doctor/steps/documents-step"
import { ReviewStep } from "@/components/doctor/steps/review-step"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

const steps = [
  { id: "basic-info", title: "Basic Information" },
  { id: "professional-info", title: "Professional Details" },
  { id: "education", title: "Education & Certifications" },
  { id: "documents", title: "Documents" },
  { id: "review", title: "Review & Submit" },
]

export function DoctorRegistrationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
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
      medicalLicense: null,
      boardCertification: null,
      hospitalPrivileges: null,
    },
  })

  const updateFormData = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/doctorApi/docregisterform", formData);
      toast({
        title: "Registration submitted successfully",
        description: "Your application is now pending review by our team.",
      })

      router.push("/doctor/registration-success")
    } catch (error) {
      console.error("Registration submission failed due to :", error)
      toast({
        title: "Something went wrong",
        description: "Your registration could not be submitted. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} onNext={nextStep} />
      case 1:
        return (
          <ProfessionalInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 2:
        return <EducationStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <DocumentsStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />
      case 4:
        return <ReviewStep formData={formData} onSubmit={handleSubmit} onPrev={prevStep} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <RegistrationProgress steps={steps} currentStep={currentStep} />
      <Card className="p-6">{renderStep()}</Card>
    </div>
  )
}
