import { Card, CardContent } from "@/components/ui/card"
import { ClipboardCheck, UserRound, Calendar, Hospital } from "lucide-react"

const steps = [
  {
    title: "Take Health Assessment",
    description: "Answer a few questions about your symptoms and health history to get personalized insights.",
    icon: ClipboardCheck,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Connect with Doctors",
    description: "Browse profiles of qualified healthcare professionals and choose the right one for your needs.",
    icon: UserRound,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Book Appointments",
    description: "Schedule consultations at your convenience, either virtually or in-person.",
    icon: Calendar,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Visit Healthcare Facilities",
    description: "Get directions and information about trusted hospitals and clinics in your area.",
    icon: Hospital,
    color: "bg-green-100 text-green-600",
  },
]

const HowItWorks = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How Curex Works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our simple process helps you take control of your health journey from start to finish.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`p-4 rounded-full ${step.color} mb-4`}>
                <step.icon className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <div className="h-0.5 w-8 bg-gray-300"></div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-700 mb-6">Ready to start your health journey with Curex?</p>
        <a
          href="/Interview/questions"
          className="inline-flex items-center justify-center rounded-md bg-curex px-6 py-3 text-white font-medium hover:bg-curex-dark transition-colors"
        >
          Take Health Assessment
        </a>
      </div>
    </div>
  )
}

export default HowItWorks
