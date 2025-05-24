"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, FileText, Download, Eye, Plus, Calendar } from "lucide-react"

const medicalRecords = [
  {
    id: 1,
    patient: "John Smith",
    type: "Lab Results",
    date: "Dec 20, 2024",
    description: "Blood work - Complete metabolic panel",
    status: "Normal",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    patient: "Sarah Johnson",
    type: "Prescription",
    date: "Dec 18, 2024",
    description: "Metformin 500mg - Diabetes management",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    patient: "Mike Wilson",
    type: "Imaging",
    date: "Dec 15, 2024",
    description: "Chest X-ray - Respiratory evaluation",
    status: "Reviewed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    patient: "Emma Davis",
    type: "Consultation Notes",
    date: "Dec 10, 2024",
    description: "Follow-up consultation - Arthritis management",
    status: "Completed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const recentRecords = medicalRecords.slice(0, 2)
const allRecords = medicalRecords

export function MedicalRecordsContent() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
      case "Active":
        return "bg-green-100 text-green-800"
      case "Reviewed":
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    return <FileText className="h-4 w-4" />
  }

  const filteredRecords = allRecords.filter(
    (record) =>
      record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-curex hover:bg-curex/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="all">All Records</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {recentRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={record.avatar || "/placeholder.svg"} alt={record.patient} />
                      <AvatarFallback>
                        {record.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{record.patient}</h3>
                      <p className="text-sm text-gray-600">{record.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {record.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          {getTypeIcon(record.type)}
                          <span className="ml-1">{record.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={record.avatar || "/placeholder.svg"} alt={record.patient} />
                      <AvatarFallback>
                        {record.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{record.patient}</h3>
                      <p className="text-sm text-gray-600">{record.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {record.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          {getTypeIcon(record.type)}
                          <span className="ml-1">{record.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Record Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Lab Results</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Prescriptions</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Imaging</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Consultation Notes</span>
                <span className="font-medium">35</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>New Records</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Updated Records</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Downloads</span>
                <span className="font-medium">156</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              Upload Lab Results
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Create Prescription
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Add Consultation Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
