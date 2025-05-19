import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StarIcon } from "lucide-react"

const testimonials = [
  {
    name: "Sita Timalsina",
    role: "Patient",
    content:
      "Curex helped me identify my symptoms and connect with a specialist quickly. The entire process was seamless and I got the care I needed.",
    avatar: "ST",
    rating: 5,
  },
  {
    name: "Dr. Munna Bhai",
    role: "Cardiologist",
    content:
      "As a healthcare provider, I appreciate how Curex streamlines the patient intake process. It allows me to focus more on providing quality care.",
    avatar: "MB",
    rating: 5,
  },
  {
    name: "Ram Bahadur",
    role: "Patient",
    content:
      "I was skeptical at first, but Curex's symptom checker was surprisingly accurate. It recommended the right specialist for my condition.",
    avatar: "RB",
    rating: 4,
  },
]

const Testimonials = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover how Curex is transforming healthcare experiences for patients and providers alike.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12 border-2 border-curex">
                  <AvatarFallback className="bg-curex/10 text-curex">{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
              </div>

              <p className="text-gray-700">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
