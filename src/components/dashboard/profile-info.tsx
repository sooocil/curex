"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Save } from "lucide-react"

export function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dob: "1985-06-15",
    gender: "Male",
    address: "123 Main St, New York, NY 10001",
    emergencyContact: "Jane Doe (+1 555-987-6543)",
    bloodType: "O+",
    allergies: "Penicillin",
    medications: "None",
  })

  

  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Here you would typically save the data to your backend
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile information</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center"
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                <AvatarFallback className="text-lg">JD</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm">
                  Change Photo
                </Button>
              )}
            </div>
            <div className="flex-1 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input id="name" value={profileData.name} onChange={(e) => handleChange("name", e.target.value)} />
                ) : (
                  <div className="text-sm">{profileData.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                ) : (
                  <div className="text-sm">{profileData.email}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input id="phone" value={profileData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                ) : (
                  <div className="text-sm">{profileData.phone}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    id="dob"
                    type="date"
                    value={profileData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                  />
                ) : (
                  <div className="text-sm">{profileData.dob}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                {isEditing ? (
                  <Input
                    id="gender"
                    value={profileData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  />
                ) : (
                  <div className="text-sm">{profileData.gender}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                ) : (
                  <div className="text-sm">{profileData.address}</div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
          <CardDescription>Your important medical details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergency">Emergency Contact</Label>
              {isEditing ? (
                <Input
                  id="emergency"
                  value={profileData.emergencyContact}
                  onChange={(e) => handleChange("emergencyContact", e.target.value)}
                />
              ) : (
                <div className="text-sm">{profileData.emergencyContact}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              {isEditing ? (
                <Input
                  id="bloodType"
                  value={profileData.bloodType}
                  onChange={(e) => handleChange("bloodType", e.target.value)}
                />
              ) : (
                <div className="text-sm">{profileData.bloodType}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              {isEditing ? (
                <Input
                  id="allergies"
                  value={profileData.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                />
              ) : (
                <div className="text-sm">{profileData.allergies}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications</Label>
              {isEditing ? (
                <Input
                  id="medications"
                  value={profileData.medications}
                  onChange={(e) => handleChange("medications", e.target.value)}
                />
              ) : (
                <div className="text-sm">{profileData.medications}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
