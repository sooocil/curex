"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

export function DoctorVerificationActions({ id }: { id: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: string) => {
    setIsLoading(true)

    try {
      // This would be replaced with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let message = ""
      switch (action) {
        case "approve":
          message = "Doctor application approved successfully"
          break
        case "reject":
          message = "Doctor application rejected"
          break
        case "request_info":
          message = "Additional information requested from doctor"
          break
      }

      toast({
        title: "Action completed",
        description: message,
      })

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/doctor-applications")
      }, 1500)
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "The action could not be completed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => handleAction("approve")}
        className="bg-green-500 hover:bg-green-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
        Approve
      </Button>
      <Button
        onClick={() => handleAction("reject")}
        className="bg-red-500 hover:bg-red-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
        Reject
      </Button>
      <Button onClick={() => handleAction("request_info")} variant="outline" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
        Request Info
      </Button>
    </div>
  )
}
