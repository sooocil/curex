"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const bloodPressureData = [
  { date: "Jan", systolic: 120, diastolic: 80 },
  { date: "Feb", systolic: 125, diastolic: 82 },
  { date: "Mar", systolic: 118, diastolic: 78 },
  { date: "Apr", systolic: 122, diastolic: 80 },
  { date: "May", systolic: 120, diastolic: 79 },
  { date: "Jun", systolic: 118, diastolic: 78 },
]

const cholesterolData = [
  { date: "Jan", total: 180, ldl: 100, hdl: 60 },
  { date: "Feb", total: 190, ldl: 110, hdl: 55 },
  { date: "Mar", total: 175, ldl: 95, hdl: 62 },
  { date: "Apr", total: 185, ldl: 105, hdl: 58 },
  { date: "May", total: 178, ldl: 98, hdl: 60 },
  { date: "Jun", total: 172, ldl: 92, hdl: 63 },
]

const glucoseData = [
  { date: "Jan", fasting: 95, postMeal: 120 },
  { date: "Feb", fasting: 98, postMeal: 125 },
  { date: "Mar", fasting: 92, postMeal: 118 },
  { date: "Apr", fasting: 96, postMeal: 122 },
  { date: "May", fasting: 94, postMeal: 120 },
  { date: "Jun", fasting: 90, postMeal: 115 },
]

export function ProfileAnalytics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Health Trends</CardTitle>
          <CardDescription>Track your health metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bloodPressure" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bloodPressure">Blood Pressure</TabsTrigger>
              <TabsTrigger value="cholesterol">Cholesterol</TabsTrigger>
              <TabsTrigger value="glucose">Blood Glucose</TabsTrigger>
            </TabsList>
            <TabsContent value="bloodPressure" className="mt-6">
              <ChartContainer
                config={{
                  systolic: {
                    label: "Systolic",
                    color: "hsl(var(--chart-1))",
                  },
                  diastolic: {
                    label: "Diastolic",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bloodPressureData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="systolic" stroke="var(--color-systolic)" name="Systolic" />
                    <Line type="monotone" dataKey="diastolic" stroke="var(--color-diastolic)" name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Normal range: 90-120 mmHg (systolic) / 60-80 mmHg (diastolic)</p>
              </div>
            </TabsContent>
            <TabsContent value="cholesterol" className="mt-6">
              <ChartContainer
                config={{
                  total: {
                    label: "Total",
                    color: "hsl(var(--chart-1))",
                  },
                  ldl: {
                    label: "LDL",
                    color: "hsl(var(--chart-2))",
                  },
                  hdl: {
                    label: "HDL",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cholesterolData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="total" stroke="var(--color-total)" name="Total" />
                    <Line type="monotone" dataKey="ldl" stroke="var(--color-ldl)" name="LDL" />
                    <Line type="monotone" dataKey="hdl" stroke="var(--color-hdl)" name="HDL" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Healthy levels: Total &lt; 200 mg/dL, LDL &lt; 100 mg/dL, HDL &gt; 60 mg/dL</p>
              </div>
            </TabsContent>
            <TabsContent value="glucose" className="mt-6">
              <ChartContainer
                config={{
                  fasting: {
                    label: "Fasting",
                    color: "hsl(var(--chart-1))",
                  },
                  postMeal: {
                    label: "Post-Meal",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={glucoseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="fasting" stroke="var(--color-fasting)" name="Fasting" />
                    <Line type="monotone" dataKey="postMeal" stroke="var(--color-postMeal)" name="Post-Meal" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Normal range: Fasting 70-99 mg/dL, Post-meal &lt; 140 mg/dL</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Results Summary</CardTitle>
          <CardDescription>Overview of your recent test results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Blood Pressure</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">120/80 mmHg</span>
                  <span className="text-sm text-green-500">Normal</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-green-500 w-[70%]" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Cholesterol</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">172 mg/dL</span>
                  <span className="text-sm text-green-500">Normal</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-green-500 w-[65%]" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Blood Glucose</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">95 mg/dL</span>
                  <span className="text-sm text-green-500">Normal</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-green-500 w-[60%]" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Vitamin D</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">28 ng/mL</span>
                  <span className="text-sm text-yellow-500">Low</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[40%]" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
