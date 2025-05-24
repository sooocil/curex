"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Download, TrendingUp, Users, Calendar, Clock } from "lucide-react"

const appointmentData = [
  { month: "Jan", appointments: 65 },
  { month: "Feb", appointments: 78 },
  { month: "Mar", appointments: 82 },
  { month: "Apr", appointments: 91 },
  { month: "May", appointments: 87 },
  { month: "Jun", appointments: 95 },
]

const patientSatisfactionData = [
  { month: "Jan", rating: 4.2 },
  { month: "Feb", rating: 4.4 },
  { month: "Mar", rating: 4.6 },
  { month: "Apr", rating: 4.5 },
  { month: "May", rating: 4.7 },
  { month: "Jun", rating: 4.8 },
]

export function ReportsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Performance Analytics</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-curex" />
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-curex" />
              <div>
                <p className="text-sm text-gray-600">Appointments</p>
                <p className="text-2xl font-bold">95</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-curex" />
              <div>
                <p className="text-sm text-gray-600">Avg Consultation</p>
                <p className="text-2xl font-bold">22m</p>
                <p className="text-xs text-gray-600">Optimal range: 15-30m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-curex" />
              <div>
                <p className="text-sm text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold">4.8/5</p>
                <p className="text-xs text-green-600">Above average</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#00AD9B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Satisfaction Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientSatisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[4.0, 5.0]} />
                <Tooltip />
                <Line type="monotone" dataKey="rating" stroke="#00AD9B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Video Consultations</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>In-Person Visits</span>
                <span>25%</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Phone Consultations</span>
                <span>10%</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Conditions Treated</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Hypertension</span>
              <Badge variant="secondary">24%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Diabetes</span>
              <Badge variant="secondary">18%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Respiratory Issues</span>
              <Badge variant="secondary">15%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Arthritis</span>
              <Badge variant="secondary">12%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Other</span>
              <Badge variant="secondary">31%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-curex">98.5%</p>
              <p className="text-sm text-gray-600">On-time Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-curex">4.2%</p>
              <p className="text-sm text-gray-600">No-show Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-curex">92%</p>
              <p className="text-sm text-gray-600">Follow-up Compliance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
