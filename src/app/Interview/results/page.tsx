"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Users, MapPin } from "lucide-react"
import dynamic from "next/dynamic"
  

const MapComponent = dynamic(() => import("./map-component"), { ssr: false })

const analysisResults = {
  possibleConditions: [
    { name: "Common Cold", probability: "High", description: "A viral infection of the upper respiratory tract." },
    { name: "Seasonal Allergies", probability: "Medium", description: "An immune response to environmental triggers." },
    { name: "Influenza", probability: "Low", description: "A viral infection that attacks your respiratory system." },
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
    position: [20.7128, -74.006] as [number, number],
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
  const [activeHospital, setActiveHospital] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleHospitalClick = (hospitalId: string) => {
    router.push(`/hospitals/${hospitalId}`)
  }

  return (
    <div className="min-h-screen max-h-20 overflow-hidden bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-[#00AD9B] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to questionnaire
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Symptom Analysis</h1>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Possible Conditions</h2>
                <div className="space-y-4">
                  {analysisResults.possibleConditions.map((condition, index) => (
                    <div key={index} className="border-l-4 border-[#00AD9B] pl-4 py-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{condition.name}</h3>
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${
                            condition.probability === "High"
                              ? "bg-red-100 text-red-800"
                              : condition.probability === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {condition.probability}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{condition.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Recommended Actions</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {analysisResults.recommendedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#00AD9B] text-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Important Note</h2>
              <p className="mb-4">
                This analysis is not a medical diagnosis. Always consult with a healthcare professional for proper
                medical advice.
              </p>
              <button className="bg-white text-[#00AD9B] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Find a Doctor
              </button>
            </div>
          </div>

          {/* Map section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Nearby Healthcare Facilities</h2>

              <div className="h-[500px] rounded-xl overflow-hidden">
                {isClient ? (
                  <MapComponent
                  
                    hospitals={hospitals}
                    activeHospital={activeHospital}
                    setActiveHospital={setActiveHospital}
                    handleHospitalClick={handleHospitalClick}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl">
                    <p className="text-gray-500">Loading map...</p>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {hospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleHospitalClick(hospital.id)}
                  >
                    <h3 className="font-semibold text-[#00AD9B] mb-2">{hospital.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{hospital.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{hospital.availableDoctors} doctors available</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

