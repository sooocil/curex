import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Brain, Salad, Moon } from "lucide-react"

const healthTips = [
  {
    title: "Heart Health",
    description: "Regular exercise can lower your risk of heart disease by up to 35%.",
    icon: Heart,
    color: "text-red-500",
  },
  {
    title: "Mental Wellness",
    description: "Practice mindfulness for 10 minutes daily to reduce stress and anxiety.",
    icon: Brain,
    color: "text-purple-500",
  },
  {
    title: "Nutrition",
    description: "Aim for 5 servings of fruits and vegetables daily for optimal health.",
    icon: Salad,
    color: "text-green-500",
  },
  {
    title: "Sleep",
    description: "Adults should aim for 7-9 hours of quality sleep each night.",
    icon: Moon,
    color: "text-blue-500",
  },
]

export function HealthTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Tips</CardTitle>
        <CardDescription>Personalized recommendations for your well-being</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {healthTips.map((tip, index) => (
            <Card key={index} className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <tip.icon className={`h-5 w-5 ${tip.color}`} />
                  <h3 className="font-medium">{tip.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
