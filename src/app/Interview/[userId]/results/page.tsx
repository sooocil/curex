"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Users, MapPin, AlertCircle } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { toast } from "sonner"

// Dynamically import map with loading fallback
type Hospital = {
  id: string
  name: string
  position: [number, number]
  address: string
  phone: string
  availableDoctors: number
  doctors: { name: string; specialty: string }[]
}

const HospitalMap = dynamic<{ hospitals: Hospital[] }>(
  () => import("./map-component"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00AD9B] mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading map...</p>
        </div>
      </div>
    ),
  }
)

const analysisResults = {
  possibleConditions: [
    {
      name: "Common Cold",
      probability: "High",
      description: "A viral infection of the upper respiratory tract.",
      color: "bg-red-100 text-red-800",
    },
    {
      name: "Seasonal Allergies",
      probability: "Medium",
      description: "An immune response to environmental triggers.",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Influenza",
      probability: "Low",
      description: "A viral infection that attacks your respiratory system.",
      color: "bg-blue-100 text-blue-800",
    },
  ],
  recommendedActions: [
    "Rest and stay hydrated",
    "Take over-the-counter pain relievers",
    "Consult with a healthcare provider if symptoms worsen",
  ],
}

const hospitals = [
  {
    id: "1",
    name: "City General Hospital",
    position: [40.7128, -74.006] as [number, number],
    address: "123 Main St, New York, NY",
    phone: "(212) 555-1234",
    availableDoctors: 8,
    doctors: [
      { name: "Dr. Sarah Johnson", specialty: "Internal Medicine" },
      { name: "Dr. Michael Chen", specialty: "Pulmonology" },
      { name: "Dr. Emily Rodriguez", specialty: "Family Medicine" },
      { name: "Dr. David Kim", specialty: "Emergency Medicine" },
    ],
  },
  {
    id: "2",
    name: "Riverside Medical Center",
    position: [40.7282, -73.9942] as [number, number],
    address: "456 Park Ave, New York, NY",
    phone: "(212) 555-5678",
    availableDoctors: 5,
    doctors: [
      { name: "Dr. James Wilson", specialty: "Cardiology" },
      { name: "Dr. Lisa Wong", specialty: "Internal Medicine" },
      { name: "Dr. Robert Smith", specialty: "Family Medicine" },
    ],
  },
  {
    id: "3",
    name: "Eastside Health Clinic",
    position: [40.7214, -73.9896] as [number, number],
    address: "789 Broadway, New York, NY",
    phone: "(212) 555-9012",
    availableDoctors: 3,
    doctors: [
      { name: "Dr. Jennifer Lee", specialty: "Pediatrics" },
      { name: "Dr. Thomas Brown", specialty: "Family Medicine" },
    ],
  },
]

export default function ResultsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Memoize hospital data for map
  const hospitalData = useMemo<any>(() => hospitals, [])

  // Optimize user authentication check
  const checkUserAuth = useCallback(() => {
    try {
      const cookies = document.cookie.split("; ").reduce(
        (acc, cookie) => {
          const [name, value] = cookie.split("=")
          acc[name] = value
          return acc
        },
        {} as Record<string, string>,
      )

      if (cookies.user) {
        const parsed = JSON.parse(decodeURIComponent(cookies.user))
        if (parsed?._id) {
          setUserId(parsed._id)
        } else {
          throw new Error("Missing _id")
        }
      } else {
        toast.error("Please log in to view results")
        router.push("/Login")
      }
    } catch (error) {
      toast.error("Invalid user session, please login again.")
      router.push("/Login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    setIsClient(true)
    checkUserAuth()
  }, [checkUserAuth])

  const handleHospitalClick = useCallback(
    (hospitalId: string) => {
      router.push(`/hospitals/${hospitalId}`)
    },
    [router],
  )

  const handleBackClick = useCallback(() => {
    router.back()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-[600px] w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-[#00AD9B] mb-6 transition-colors p-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to questionnaire
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analysis Results */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">Your Symptom Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Possible Conditions</h3>
                  <div className="space-y-4">
                    {analysisResults.possibleConditions.map((condition, index) => (
                      <div key={index} className="border-l-4 border-[#00AD9B] pl-4 py-3 bg-gray-50 rounded-r-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-800">{condition.name}</h4>
                          <Badge className={condition.color}>{condition.probability}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{condition.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Recommended Actions</h3>
                  <ul className="space-y-2">
                    {analysisResults.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-[#00AD9B] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#00AD9B] text-white shadow-lg border-none">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Important Note</h3>
                    <p className="mb-4 text-white/90">
                      This analysis is not a medical diagnosis. Always consult with a healthcare professional for proper
                      medical advice.
                    </p>
                  </div>
                </div>
                {userId && (
                  <Button className="bg-white text-[#00AD9B] hover:bg-gray-100 font-medium w-full">
                    <Link href={`/user/${userId}/dashboard/doctors`}>Find a Doctor</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map and Hospitals */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-none h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">Nearby Healthcare Facilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[500px] rounded-xl overflow-hidden">
                  {isClient && <HospitalMap hospitals={hospitalData as any} />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {hospitals.map((hospital) => (
                    <Card
                      key={hospital.id}
                      className="hover:shadow-md transition-all duration-200 cursor-pointer border-gray-200 hover:border-[#00AD9B]/30"
                      onClick={() => handleHospitalClick(hospital.id)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-[#00AD9B] mb-2 text-sm">{hospital.name}</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 line-clamp-2">{hospital.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-600">{hospital.availableDoctors} doctors available</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
