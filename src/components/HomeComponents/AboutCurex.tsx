"use client"

import { Button } from "@/components/ui/button"
import { Shield, Heart, Zap } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Trusted Healthcare",
    description:
      "All healthcare providers on our platform are verified and credentialed to ensure you receive quality care.",
  },
  {
    icon: Heart,
    title: "Patient-Centered",
    description: "We prioritize your health needs and preferences, making healthcare more accessible and personalized.",
  },
  {
    icon: Zap,
    title: "Efficient Process",
    description:
      "Save time with our streamlined approach to healthcare, from symptom assessment to appointment booking.",
  },
]

const AboutCurex = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <img 
          // src image from the public folder
            src="/assets/doctorAboutUs/aboutCurex.jpg"
            width={750}
            height={750}
            alt="About Curex"
            className="rounded-lg shadow-xl"

           />
        </div>

        <div className="lg:w-1/2">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Curex</h2>

          <p className="text-lg text-gray-700 mb-6">
            Curex was founded with a simple mission: to make healthcare more accessible, efficient, and personalized. We
            believe that everyone deserves easy access to quality healthcare services.
          </p>

          <div className="space-y-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-curex/10 p-3 rounded-full">
                  <feature.icon className="h-6 w-6 text-curex" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="bg-curex hover:bg-curex-dark text-white"
            onClick={() => (window.location.href = "/Register")}
          >
            Join Curex Today
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AboutCurex
