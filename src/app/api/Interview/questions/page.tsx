"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import QuestionStep from "./question-step";
import axios from "axios";
import toast from "react-hot-toast";

export default function SymptomAssessment() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 10;

  const [answers, setAnswers] = useState({
    q1: "", // Main symptom
    q2: "", // Duration
    q3: "", // Fever (Yes/No)
    q4: 98.6, // Temperature
    q5: "", // Cough (Yes/No)
    q6: "", // Cough type
    q7: 0, // Pain level
    q8: "", // Fatigue (Yes/No)
    q9: "", // Contact with sick person (Yes/No)
    q10: "", // Other symptoms
  });

  const pushToBackend = async (data: any) => {
    try {
      //Get userId from local storage or token or session
      const userId = localStorage.getItem("userId") || "defaultUserId";

      const response = await axios.post(
        "http://localhost:3000/api/symptom-assessment", 
        {
          ...data,
          userId: userId, 
        }
      );
      if (response.status === 200) {
        console.log("Data pushed to backend successfully");
        toast.success("Data pushed to backend successfully");
      } else {
        console.error("Failed to push data to backend");
        toast.error("Failed to push data to backend");
      }
    } catch (error) {
      console.error("Error pushing data to backend:", error);
      toast.error("Error pushing data to backend");
    }
  };

  const updateAnswer = (question: string, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    pushToBackend(answers);
    console.log("Form submitted with answers:", answers);
    router.push("/Interview/results")
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "What symptom are you experiencing the most?";
      case 2:
        return "How long have you had this symptom?";
      case 3:
        return "Do you have a fever?";
      case 4:
        return "What is your fever temperature (if any)?";
      case 5:
        return "Do you have a cough?";
      case 6:
        return "What type of cough?";
      case 7:
        return "Rate your overall pain level";
      case 8:
        return "Are you experiencing fatigue or tiredness?";
      case 9:
        return "Have you had contact with a sick person recently?";
      case 10:
        return "Do you have other symptoms to report?";
      default:
        return "Symptom Assessment";
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !answers.q1;
      case 2:
        return !answers.q2;
      case 3:
        return !answers.q3;
      case 5:
        return !answers.q5;
      case 6:
        return answers.q5 === "Yes" && !answers.q6;
      case 8:
        return !answers.q8;
      case 9:
        return !answers.q9;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-gray-600 hover:text-[#00AD9B] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Symptom Assessment
          </h1>
          <p className="text-gray-600 mt-2">
            Please answer the following questions to help us understand your
            symptoms better.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#00AD9B] h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="rounded-2xl shadow-lg border-none overflow-hidden">
          <div className="bg-[#00AD9B] text-white py-4 px-6">
            <h2 className="text-xl font-semibold">{getStepTitle()}</h2>
          </div>

          <div className="p-6">
            <QuestionStep
              step={step}
              answers={answers}
              updateAnswer={updateAnswer}
            />

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="border-gray-300 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-[#00AD9B] hover:bg-[#009688] text-white"
                  disabled={isNextDisabled()}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-[#00AD9B] hover:bg-[#009688] text-white"
                >
                  Submit Assessment
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800">
          <h3 className="font-semibold mb-2">Important Note</h3>
          <p className="text-sm">
            This symptom assessment is not a medical diagnosis. The information
            provided will be used to guide you to appropriate healthcare
            resources. If you're experiencing severe symptoms, please seek
            immediate medical attention.
          </p>
        </div>
      </div>
    </div>
  );
}
