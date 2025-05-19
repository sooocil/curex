import HomeNav from "@/components/HomeComponents/HomeNav"
import HomeHero from "@/components/HomeComponents/HomeHero"
import BetaTop from "@/components/HomeComponents/BetaTop"
import Testimonials from "@/components/HomeComponents/Testimonials"
import HowItWorks from "@/components/HomeComponents/HowItWorks"
import AboutCurex from "@/components/HomeComponents/AboutCurex"
import Footer from "@/components/HomeComponents/Footer"
import { Providers } from "@/components/providers"

export default function Home() {
  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 flex flex-col">
        <BetaTop />

        {/* Centered Navigation */}
        <div className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
          <HomeNav />
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <section className="py-16 md:py-24">
            <HomeHero />
          </section>

          {/* Testimonials Section */}
          <section className="py-16 bg-white">
            <Testimonials />
          </section>

          {/* How It Works Section */}
          <section className="py-16 bg-gray-50">
            <HowItWorks />
          </section>

          {/* About Curex Section */}
          <section className="py-16 bg-white">
            <AboutCurex />
          </section>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </Providers>
  )
}
