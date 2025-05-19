"use client"

import { lusitana } from "@/app/fonts/fonts"
import { Button } from "@/components/ui/button"
import { TiTick } from "react-icons/ti"

const HomeHero = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-6 max-w-xl">
          <h1
            className={`${lusitana.className} text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight`}
          >
            The Only Cure For Your Health Problems
          </h1>

          <p className="text-lg text-gray-600">
            Curex connects you with qualified healthcare professionals and provides tools to manage your health
            effectively.
          </p>

          <ul className="space-y-3">
            {[
              "Identify potential health issues",
              "Connect with medical experts",
              "Book & manage appointments",
              "Access trusted hospitals & clinics",
            ].map((item, index) => (
              <li key={index} className="text-lg flex items-center gap-2">
                <span className="text-curex text-xl">
                  <TiTick />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              size="lg"
              className="bg-curex hover:bg-curex-dark text-white"
              onClick={() => (window.location.href = "/Interview/questions")}
            >
              Take Health Assessment
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-curex text-curex hover:bg-curex/10"
              onClick={() => (window.location.href = "/Register")}
            >
              Create Account
            </Button>
          </div>
        </div>

        <div className="w-full md:w-1/2 mt-8 md:mt-0">
          <img src="/HomeDoctors.svg" className="select-none w-full h-auto max-w-lg mx-auto" alt="Online Doctor Consultation" />
        </div>
      </div>
    </div>
  )
}

export default HomeHero
