"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuestionStepProps {
  step: number
  answers: {
    [key: string]: string | number
  }
  updateAnswer: (question: string, value: string | number) => void
}

export default function QuestionStep({ step, answers, updateAnswer }: QuestionStepProps) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-4">
          <p className="text-gray-600">Please enter the main symptom you're experiencing right now.</p>
          <Input
            id="main-symptom"
            placeholder="e.g., Headache, Cough, Fever, etc."
            value={answers.q1 as string}
            onChange={(e) => updateAnswer("q1", e.target.value)}
            className="w-full"
          />
        </div>
      )

    case 2:
      return (
        <div className="space-y-4">
          <p className="text-gray-600">How long have you been experiencing this symptom?</p>
          <Select value={answers.q2 as string} onValueChange={(value) => updateAnswer("q2", value)}>
            <SelectTrigger id="symptom-duration" className="w-full">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3 days">1-3 days</SelectItem>
              <SelectItem value="4-7 days">4-7 days</SelectItem>
              <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
              <SelectItem value="More than 2 weeks">More than 2 weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )

    case 3:
      return (
        <div className="space-y-4">
          <p className="text-gray-600">Are you currently experiencing a fever?</p>
          <RadioGroup
            value={answers.q3 as string}
            onValueChange={(value) => updateAnswer("q3", value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="Yes" id="fever-yes" />
              <Label htmlFor="fever-yes" className="flex-1 cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="No" id="fever-no" />
              <Label htmlFor="fever-no" className="flex-1 cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>
      )

    case 4:
      return (
        <div className="space-y-6">
          <p className="text-gray-600">
            {answers.q3 === "Yes"
              ? "What is your current body temperature (in °F)?"
              : "If you were to take your temperature, what do you think it would be?"}
          </p>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-[#00AD9B]">{answers.q4}°F</span>
              <div className="flex space-x-2 text-sm">
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">Normal</span>
                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Mild</span>
                <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800">Moderate</span>
                <span className="px-2 py-1 rounded-full bg-red-100 text-red-800">High</span>
              </div>
            </div>
            <Slider
              value={[answers.q4 as number]}
              min={95}
              max={105}
              step={0.1}
              onValueChange={(value) => updateAnswer("q4", value[0])}
              className="[&>span]:bg-[#00AD9B]"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>95°F</span>
              <span>98.6°F</span>
              <span>105°F</span>
            </div>
          </div>
          {answers.q3 === "No" && (
            <p className="text-sm text-gray-500 italic">
              You indicated no fever, but you can still adjust the temperature if needed.
            </p>
          )}
        </div>
      )

    case 5:
      return (
        <div className="space-y-4">
          <p className="text-gray-600">Are you experiencing a cough?</p>
          <RadioGroup
            value={answers.q5 as string}
            onValueChange={(value) => updateAnswer("q5", value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="Yes" id="cough-yes" />
              <Label htmlFor="cough-yes" className="flex-1 cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="No" id="cough-no" />
              <Label htmlFor="cough-no" className="flex-1 cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>
      )

    case 6:
      return (
        <div className="space-y-4">
          <p className="text-gray-600">What type of cough are you experiencing?</p>
          <Select
            value={answers.q6 as string}
            onValueChange={(value) => updateAnswer("q6", value)}
            disabled={answers.q5 !== "Yes"}
          >
            <SelectTrigger id="cough-type" className="w-full">
              <SelectValue placeholder="Select cough type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dry">Dry (non-productive)</SelectItem>
              <SelectItem value="Wet/Productive">Wet/Productive (with phlegm/mucus)</SelectItem>
              <SelectItem value="None">None</SelectItem>
            </SelectContent>
          </Select>
          {answers.q5 !== "Yes" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">You indicated no cough. You can skip this question.</p>
            </div>
          )}
        </div>
      )

    case 7:
      return (
        <div className="space-y-6">
          <p className="text-gray-600">On a scale of 0-10, how would you rate your overall pain level?</p>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-[#00AD9B]">{answers.q7}</span>
              <div className="text-sm">
                <span
                  className={`px-2 py-1 rounded-full ${
                    Number(answers.q7) <= 3
                      ? "bg-green-100 text-green-800"
                      : Number(answers.q7) <= 6
                        ? "bg-yellow-100 text-yellow-800"
                        : Number(answers.q7) <= 8
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {Number(answers.q7) <= 3 ? "Mild" : Number(answers.q7) <= 6 ? "Moderate" : Number(answers.q7) <= 8 ? "Severe" : "Extreme"}
                </span>
              </div>
            </div>
            <Slider
              value={[Number(answers.q7) || 98.6 ]}
              min={0}
              max={10}
              step={1}
              onValueChange={(value) => updateAnswer("q7", value[0])}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>No pain (0)</span>
              <span>Moderate (5)</span>
              <span>Severe (10)</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-green-100 mx-auto"></div>
              <p className="text-xs mt-1">Mild</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-yellow-100 mx-auto"></div>
              <p className="text-xs mt-1">Moderate</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-orange-100 mx-auto"></div>
              <p className="text-xs mt-1">Severe</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-red-100 mx-auto"></div>
              <p className="text-xs mt-1">Extreme</p>
            </div>
          </div>
        </div>
      )

    case 8:
      return (
        <div className="space-y-4">
          <p className="text-gray-600">Are you experiencing unusual fatigue or tiredness?</p>
          <RadioGroup
            value={answers.q8 as string}
            onValueChange={(value) => updateAnswer("q8", value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="Yes" id="fatigue-yes" />
              <Label htmlFor="fatigue-yes" className="flex-1 cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="No" id="fatigue-no" />
              <Label htmlFor="fatigue-no" className="flex-1 cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>
      )

    case 9:
      return (
        <div className="space-y-4">
          <p className="text-gray-600">Have you had close contact with someone who was sick in the past 14 days?</p>
          <RadioGroup
            value={answers.q9 as string}
            onValueChange={(value) => updateAnswer("q9", value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="Yes" id="contact-yes" />
              <Label htmlFor="contact-yes" className="flex-1 cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="No" id="contact-no" />
              <Label htmlFor="contact-no" className="flex-1 cursor-pointer">
                No
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="Not Sure" id="contact-not-sure" />
              <Label htmlFor="contact-not-sure" className="flex-1 cursor-pointer">
                Not Sure
              </Label>
            </div>
          </RadioGroup>
        </div>
      )

    case 10:
      return (
        <div className="space-y-4">
          <p className="text-gray-600">
            Please describe any other symptoms or health concerns you're experiencing (optional).
          </p>
          <Textarea
            id="other-symptoms"
            placeholder="Enter any additional symptoms or details about your condition..."
            value={answers.q10 as string}
            onChange={(e) => updateAnswer("q10", e.target.value)}
            className="min-h-[150px] resize-none"
          />
        </div>
      )

    default:
      return null
  }
}
