"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react"

export default function QuestionsPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)

  // Update questions based on answers
  useEffect(() => {
    const updatedQuestions = [...initialQuestions]

    // Add conditional questions based on answers
    if (answers["q1"] === "Yes") {
      // If user has fever, add follow-up questions about fever
      if (!updatedQuestions.some((q) => q.id === "q6")) {
        updatedQuestions.splice(2, 0, {
          id: "q6",
          text: "How high is your fever?",
          type: "slider",
          min: 97,
          max: 105,
          step: 0.1,
          unit: "°F",
        })
      }
    }

    if (answers["q2"] === "Yes") {
      // If user has cough, add follow-up questions about cough
      if (!updatedQuestions.some((q) => q.id === "q7")) {
        updatedQuestions.splice(3, 0, {
          id: "q7",
          text: "What type of cough are you experiencing?",
          type: "radio",
          options: ["Dry", "Wet/Productive", "Both"],
        })
      }
    }

    if (answers["q3"] && Number.parseInt(answers["q3"]) >= 7) {
      // If pain level is high, add follow-up question
      if (!updatedQuestions.some((q) => q.id === "q8")) {
        updatedQuestions.splice(4, 0, {
          id: "q8",
          text: "Does the pain radiate to other areas?",
          type: "radio",
          options: ["Yes", "No"],
        })
      }
    }

    setQuestions(updatedQuestions)
  }, [answers])

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      router.push("/Interview/results")
    }, 2000)
  }

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
          <div
            className="h-full bg-[#00AD9B] rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-8">
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {questions.length}
          </span>
        </div>

        {/* Question content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[200px]"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.text}</h2>

            {/* Different input types based on question type */}
            {currentQuestion.type === "radio" && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      answers[currentQuestion.id] === option
                        ? "border-[#00AD9B] bg-[#00AD9B]/10"
                        : "border-gray-200 hover:border-[#00AD9B]/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleAnswerChange(currentQuestion.id, option)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        answers[currentQuestion.id] === option ? "border-[#00AD9B]" : "border-gray-300"
                      }`}
                    >
                      {answers[currentQuestion.id] === option && <div className="w-3 h-3 rounded-full bg-[#00AD9B]" />}
                    </div>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === "slider" && (
              <div className="space-y-4">
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  step={currentQuestion.step}
                  value={answers[currentQuestion.id] || currentQuestion.min}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00AD9B]"
                />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {currentQuestion.min}
                    {currentQuestion.unit}
                  </span>
                  <span className="text-lg font-medium text-[#00AD9B]">
                    {answers[currentQuestion.id] || currentQuestion.min}
                    {currentQuestion.unit}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentQuestion.max}
                    {currentQuestion.unit}
                  </span>
                </div>
              </div>
            )}

            {currentQuestion.type === "dropdown" && (
              <select
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AD9B] focus:border-transparent"
              >
                <option value="" disabled>
                  Select an option
                </option>
                {currentQuestion.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {currentQuestion.type === "text" && (
              <input
                type="text"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AD9B] focus:border-transparent"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-10">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-lg transition-all ${
              currentStep === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id] || isSubmitting}
            className={`flex items-center px-6 py-2 rounded-lg text-white transition-all ${
              !answers[currentQuestion.id] || isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#00AD9B] hover:bg-[#009688]"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing
              </>
            ) : currentStep === questions.length - 1 ? (
              "Submit"
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Types
interface Question {
  id: string
  text: string
  type: "radio" | "slider" | "dropdown" | "text"
  options?: string[]
  min?: number
  max?: number
  step?: number
  unit?: string
  placeholder?: string
}

// Initial questions
const initialQuestions: Question[] = [
  {
    id: "q1",
    text: "Are you experiencing fever?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "q2",
    text: "Do you have a cough?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: "q3",
    text: "On a scale of 1-10, how would you rate your pain?",
    type: "slider",
    min: 1,
    max: 10,
    step: 1,
    unit: "",
  },
  {
    id: "q4",
    text: "How long have you been experiencing these symptoms?",
    type: "dropdown",
    options: ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week"],
  },
  {
    id: "q5",
    text: "Please describe any other symptoms you are experiencing",
    type: "text",
    placeholder: "Type your answer here...",
  },
]

