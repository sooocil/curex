"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label as UILable } from "@/components/ui/label"

const educationItemSchema = z.object({
  degree: z.string(),
  institution: z.string().min(2, { message: "Institution is required" }),
  year: z.string().min(4, { message: "Year is required" }),
})

const certificationItemSchema = z.object({
  name: z.string(),
  issuer: z.string().min(2, { message: "Issuer is required" }),
  year: z.string().min(4, { message: "Year is required" }),
})

const formSchema = z.object({
  education: z.array(educationItemSchema),
  certifications: z.array(certificationItemSchema),
})

interface EducationStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export function EducationStep({ formData, updateFormData, onNext, onPrev }: EducationStepProps) {
  const [education, setEducation] = useState(
    formData.education || [
      { degree: "MD", institution: "", year: "" },
      { degree: "Residency in Internal Medicine", institution: "", year: "" },
      { degree: "Fellowship in Cardiology", institution: "", year: "" },
    ],
  )

  const [certifications, setCertifications] = useState(
    formData.certifications || [
      { name: "Board Certification in Cardiology", issuer: "", year: "" },
      { name: "Advanced Cardiac Life Support (ACLS)", issuer: "", year: "" },
    ],
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education,
      certifications,
    },
  })

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    setEducation(updatedEducation)
    form.setValue("education", updatedEducation)
  }

  const handleCertificationChange = (index: number, field: string, value: string) => {
    const updatedCertifications = [...certifications]
    updatedCertifications[index] = { ...updatedCertifications[index], [field]: value }
    setCertifications(updatedCertifications)
    form.setValue("certifications", updatedCertifications)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateFormData({
      education: values.education,
      certifications: values.certifications,
    })
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Education & Certifications</h2>
        <p className="text-sm text-gray-500">Add your educational background and professional certifications</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Education</h3>

            {education.map((edu:any, index:number) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <UILable htmlFor={`education.${index}.degree`}>Degree</UILable>
                      <Input
                        id={`education.${index}.degree`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        className="mt-1"
                        readOnly={index < 3} // Make the predefined degrees read-only
                      />
                    </div>
                    <div>
                      <UILable htmlFor={`education.${index}.institution`}>Institution</UILable>
                      <Input
                        id={`education.${index}.institution`}
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        placeholder="Harvard Medical School"
                        className="mt-1"
                      />
                      {form.formState.errors.education?.[index]?.institution && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.education[index]?.institution?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <UILable htmlFor={`education.${index}.year`}>Year</UILable>
                      <Input
                        id={`education.${index}.year`}
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                        placeholder="2008"
                        className="mt-1"
                      />
                      {form.formState.errors.education?.[index]?.year && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.education[index]?.year?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Certifications</h3>

            {certifications.map((cert:any, index:number) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <UILable htmlFor={`certifications.${index}.name`}>Certification</UILable>
                      <Input
                        id={`certifications.${index}.name`}
                        value={cert.name}
                        onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                        className="mt-1"
                        readOnly={index < 2} // Make the predefined certifications read-only
                      />
                    </div>
                    <div>
                      <UILable htmlFor={`certifications.${index}.issuer`}>Issuing Organization</UILable>
                      <Input
                        id={`certifications.${index}.issuer`}
                        value={cert.issuer}
                        onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                        placeholder="American Board of Internal Medicine"
                        className="mt-1"
                      />
                      {form.formState.errors.certifications?.[index]?.issuer && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.certifications[index]?.issuer?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <UILable htmlFor={`certifications.${index}.year`}>Year</UILable>
                      <Input
                        id={`certifications.${index}.year`}
                        value={cert.year}
                        onChange={(e) => handleCertificationChange(index, "year", e.target.value)}
                        placeholder="2015"
                        className="mt-1"
                      />
                      {form.formState.errors.certifications?.[index]?.year && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.certifications[index]?.year?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              Back
            </Button>
            <Button type="submit" className="bg-curex hover:bg-curex-dark text-white">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
