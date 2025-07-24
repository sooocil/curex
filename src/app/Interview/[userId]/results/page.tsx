"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

import { useDoctorStore } from "@/stores/doctorStores/doctorStore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const HospitalMap = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] sm:h-[400px] rounded-xl flex items-center justify-center bg-gray-100">
      <Loader2 className="h-8 w-8 animate-spin text-[#00AD9B]" />
    </div>
  ),
});

const hospitals = [
  {
    id: "1",
    name: "Bharatpur Central Hospital",
    position: [27.68, 84.43] as [number, number],
    address: "Bharatpur-10, Chitwan, Nepal",
    phone: "(056) 527852",
    availableDoctors: 8,
    doctors: [
      { name: "Dr. Anisha Sharma", specialty: "Internal Medicine" },
      { name: "Dr. Rajesh Poudel", specialty: "Pulmonology" },
      { name: "Dr. Sunita Gurung", specialty: "Family Medicine" },
      { name: "Dr. Deepak Adhikari", specialty: "Emergency Medicine" },
    ],
  },
  {
    id: "2",
    name: "Chitwan Medical College",
    position: [27.6766, 84.4312] as [number, number],
    address: "Bharatpur-5, Chitwan, Nepal",
    phone: "(056) 532933",
    availableDoctors: 5,
    doctors: [
      { name: "Dr. Prakash Thapa", specialty: "Cardiology" },
      { name: "Dr. Sabina Shrestha", specialty: "Internal Medicine" },
      { name: "Dr. Rajan Khatiwada", specialty: "Family Medicine" },
    ],
  },
  {
    id: "3",
    name: "Narayani Community Hospital",
    position: [27.6712, 84.4278] as [number, number],
    address: "Bharatpur-3, Chitwan, Nepal",
    phone: "(056) 520300",
    availableDoctors: 3,
    doctors: [
      { name: "Dr. Manisha Koirala", specialty: "Pediatrics" },
      { name: "Dr. Binod Tamang", specialty: "Family Medicine" },
    ],
  },
];

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
};

export default function ResultsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { doctors, isLoading, error, fetchDoctors } = useDoctorStore();

  const checkUserAuth = useCallback(() => {
    try {
      const cookies = document.cookie
        .split("; ")
        .reduce((acc, cookie) => {
          const [name, value] = cookie.split("=");
          acc[name] = value;
          return acc;
        }, {} as Record<string, string>);

      if (cookies.user) {
        const parsed = JSON.parse(decodeURIComponent(cookies.user));
        if (parsed?._id) setUserId(parsed._id);
        else throw new Error("Missing user ID");
      } else {
        toast.error("Please log in to view results");
        router.push("/Login");
      }
    } catch {
      toast.error("Invalid user session, please login again.");
      router.push("/Login");
    }
  }, [router]);

  useEffect(() => {
    setIsClient(true);
    checkUserAuth();
    fetchDoctors();
  }, [checkUserAuth, fetchDoctors]);

  const handleBackClick = () => router.back();
  const handleHospitalClick = (id: string) => router.push(`/hospitals/${id}`);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <Skeleton className="h-10 w-48 mb-8" />
        <Loader2 className="animate-spin text-[#00AD9B] h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 px-4">
        Error loading doctors: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-[#00AD9B] mb-6 transition-colors p-2 sm:p-0"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to questionnaire
        </Button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="w-full lg:w-1/3 space-y-6">
            <Card className="shadow-lg border-none rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                  Symptom Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                    Possible Conditions
                  </h3>
                  <div className="space-y-4">
                    {analysisResults.possibleConditions.map((condition, i) => (
                      <div
                        key={i}
                        className="border-l-4 border-[#00AD9B] pl-4 py-3 bg-gray-50 rounded-r-lg"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                          <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                            {condition.name}
                          </h4>
                          <Badge className={`${condition.color} text-xs sm:text-sm`}>
                            {condition.probability}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {condition.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                    Recommended Actions
                  </h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-700 text-xs sm:text-sm">
                    {analysisResults.recommendedActions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#00AD9B] text-white shadow-lg border-none rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      Important Note
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm">
                      This analysis is not a medical diagnosis. Always consult
                      with a healthcare professional for proper medical advice.
                    </p>
                  </div>
                </div>
                {userId && (
                  <Button className="bg-white text-[#00AD9B] hover:bg-gray-100 font-semibold w-full text-xs sm:text-sm rounded-lg">
                    <Link href={`/user/${userId}/dashboard/doctors`}>
                      Find a Doctor
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-2/3">
            <Card className="shadow-lg border-none rounded-2xl h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                  Nearby Healthcare Facilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
                  {isClient && <HospitalMap hospitals={hospitals} />}
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-6 mb-4">
                  Recommended Doctors
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {doctors.map((doc) => (
                    <Card
                      key={doc._id || doc.id}
                      className="cursor-pointer border border-gray-200 hover:shadow-lg transition-shadow rounded-lg"
                      onClick={() => router.push(`http://localhost:3000/user/${userId}/dashboard/doctors`)}
                    >
                      <CardContent className="p-4 sm:p-5">
                        <h4 className="text-[#00AD9B] font-semibold text-base sm:text-lg mb-1">
                          {doc.name}
                        </h4>
                        <p className="text-gray-700 text-sm sm:text-base">{doc.specialty}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{doc.hospital}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Contact: {doc.contact}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Rate: {doc.rate}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Rating: {doc.rating} ({doc.reviews} reviews)
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Availability: {doc.availability}</p>
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
  );
}