"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const params = useParams();
  const currentUserId = params.userId;

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

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce(
      (acc, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    let userId: string | undefined;
    if (cookies.user) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookies.user));
        userId = parsed._id;
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
      }
    }

    if (!userId) {
      console.error("No userId found in cookie");
      toast.error("Please log in to submit assessment");
      router.push("/Login");
      return;
    }
  }, []);

  const pushToBackend = async (data: any) => {
    try {
      console.log("=== Frontend: Starting submission ===");

      // Get userId from cookies
      const cookies = document.cookie.split("; ").reduce(
        (acc, cookie) => {
          const [name, value] = cookie.split("=");
          acc[name] = value;
          return acc;
        },
        {} as Record<string, string>
      );

      let userId: string | undefined;
      if (cookies.user) {
        try {
          const parsed = JSON.parse(decodeURIComponent(cookies.user));
          userId = parsed._id;
          console.log("✅ UserId extracted from cookie:", userId);
        } catch (error) {
          console.error("❌ Failed to parse user cookie:", error);
        }
      }

      if (!userId) {
        console.error("❌ No userId found in cookie");
        toast.error("Please log in to submit assessment");
        router.push("/Login");
        return;
      }

      // Transform the data
      const transformedData = {
        userId: userId,
        mainSymptom: data.q1,
        duration: data.q2,
        hasFever: data.q3,
        temperature: data.q4,
        hasCough: data.q5,
        coughType: data.q6,
        painLevel: data.q7,
        hasFatigue: data.q8,
        contactWithSick: data.q9,
        otherSymptoms: data.q10,
      };

      console.log("✅ Data transformed:", transformedData);

      const response = await axios.post(
        "/api/interview/pushint/",
        transformedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Response received:", response.status, response.data);
      setTimeout(() => {
        if (response.status === 201) {
          console.log("✅ Assessment submitted successfully");
          return response.data;
        }
        toast.success("Assessment submitted successfully");
      }, 1000);
    } catch (error) {
      console.error("❌ Error submitting assessment:", error);

      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);

        if (error.response?.status === 400) {
          const errorData = error.response.data;
          toast.error(
            `Validation Error: ${errorData.message || "Invalid data format"}`
          );
        } else if (error.response?.status === 500) {
          const errorData = error.response.data;
          toast.error(
            `Server Error: ${errorData.message || "Please try again later"}`
          );
        } else {
          toast.error("Network error. Please check your connection.");
        }
      } else {
        toast.error("Unexpected error occurred");
      }

      throw error;
    }
  };

  // Also fix the handleSubmit function
  const handleSubmit = async () => {
    try {
      console.log("=== Starting form submission ===");
      console.log("Current answers:", answers);

      await pushToBackend(answers);

      // Get userId from useParams

      console.log(
        "✅ Submission successful, redirecting to:",
        `/Interview/${currentUserId}/results`
      );
      router.push(`/Interview/${currentUserId}/results`);
    } catch (error) {
      console.error("❌ Submission failed:", error);
      // Error is already handled in pushToBackend, just prevent redirect
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

  const userId = useParams().userId;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push(`/user/${userId}/dashboard/tests`)}
          className="flex items-center text-gray-600 hover:text-[#00AD9B] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
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
