"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface DocumentsStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

// Maximum file size: 500KB
const MAX_FILE_SIZE = 500 * 1024 // 500KB in bytes

export function DocumentsStep({ formData, updateFormData, onNext, onPrev }: DocumentsStepProps) {
  const [documents, setDocuments] = useState({
    medicalLicense: formData.documents?.medicalLicense || null,
    boardCertification: formData.documents?.boardCertification || null,
    hospitalPrivileges: formData.documents?.hospitalPrivileges || null,
  })

  const [uploading, setUploading] = useState({
    medicalLicense: false,
    boardCertification: false,
    hospitalPrivileges: false,
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `The file exceeds the maximum size of 500KB. Please upload a smaller file.`,
          variant: "destructive",
        })
        return
      }

      // Simulate file upload
      setUploading((prev) => ({ ...prev, [documentType]: true }))

      // Simulate upload delay
      setTimeout(() => {
        setUploading((prev) => ({ ...prev, [documentType]: false }))
        setDocuments((prev) => ({
          ...prev,
          [documentType]: {
            name: file.name,
            size: file.size,
            type: file.type,
          },
        }))
      }, 1500)
    }
  }

  const handleSubmit = () => {
    updateFormData({ documents })
    onNext()
  }

  const isComplete = documents.medicalLicense && documents.boardCertification 

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Required Documents</h2>
        <p className="text-sm text-gray-500">Upload the necessary documents to verify your credentials</p>
        <p className="text-xs text-red-500 mt-1">All files must be less than 500KB in size</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Medical License</CardTitle>
            <CardDescription>Upload a copy of your current medical license</CardDescription>
          </CardHeader>
          <CardContent>
            {documents.medicalLicense ? (
              <div className="flex items-center justify-between p-2 border rounded-md bg-green-50">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="font-medium">{documents.medicalLicense.name}</p>
                    <p className="text-xs text-gray-500">{(documents.medicalLicense.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDocuments((prev) => ({ ...prev, medicalLicense: null }))}
                >
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-md">
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    {uploading.medicalLicense ? "Uploading..." : "Click to upload"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (max 500KB)</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "medicalLicense")}
                    disabled={uploading.medicalLicense}
                  />
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Board Certification</CardTitle>
            <CardDescription>Upload a copy of your board certification</CardDescription>
          </CardHeader>
          <CardContent>
            {documents.boardCertification ? (
              <div className="flex items-center justify-between p-2 border rounded-md bg-green-50">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="font-medium">{documents.boardCertification.name}</p>
                    <p className="text-xs text-gray-500">{(documents.boardCertification.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDocuments((prev) => ({ ...prev, boardCertification: null }))}
                >
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-md">
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    {uploading.boardCertification ? "Uploading..." : "Click to upload"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (max 500KB)</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "boardCertification")}
                    disabled={uploading.boardCertification}
                  />
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        
      </div>

      {!isComplete && (
        <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
          <p className="text-sm text-yellow-700">Please upload all required documents to proceed</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button
          type="button"
          className="bg-curex hover:bg-curex-dark text-white"
          onClick={handleSubmit}
          disabled={!isComplete}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
