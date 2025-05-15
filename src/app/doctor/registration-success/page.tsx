import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function RegistrationSuccessPage() {
  return (
    <div className="container max-w-md py-20">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Application Submitted!</h1>
        <p className="text-gray-600">
          Thank you for applying to join Curex as a healthcare provider. Our team will review your application and
          credentials.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-left">
          <h2 className="font-medium text-blue-800 mb-2">What happens next?</h2>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>1. Our team will review your application (typically within 2-3 business days)</li>
            <li>2. We may contact you for additional information if needed</li>
            <li>3. Once approved, you'll receive an email with instructions to access your doctor dashboard</li>
          </ul>
        </div>
        <div className="pt-4">
          <Button asChild className="bg-curex hover:bg-curex-dark text-white">
            <Link href="/Home">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
