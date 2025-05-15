import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
}

interface RegistrationProgressProps {
  steps: Step[]
  currentStep: number
}

export function RegistrationProgress({ steps, currentStep }: RegistrationProgressProps) {
  return (
    <div className="hidden md:block">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <ul className="relative flex justify-between">
          {steps.map((step, index) => (
            <li key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full",
                  index < currentStep
                    ? "bg-curex text-white"
                    : index === currentStep
                      ? "bg-curex text-white"
                      : "bg-gray-100 text-gray-500",
                )}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <span>{index + 1}</span>
                )}
                <span className="sr-only">{step.title}</span>
              </div>
              <div
                className={cn(
                  "absolute mt-10 text-center text-xs font-medium",
                  index <= currentStep ? "text-curex" : "text-gray-500",
                )}
                style={{ width: "100px", marginLeft: "-50px" }}
              >
                {step.title}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Add extra space below the progress bar to accommodate the titles */}
      <div className="h-12"></div>
    </div>
  )
}
