import type { Metadata } from "next"
import { ProfileInfo } from "@/components/dashboard/profile-info"
import { ProfileAnalytics } from "@/components/dashboard/profile-analytics"
import { ProfileSettings } from "@/components/dashboard/profile-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Profile | Curex",
  description: "Manage your Curex profile",
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="info">Profile Info</TabsTrigger>
          <TabsTrigger value="analytics">Health Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-6">
          <ProfileInfo />
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <ProfileAnalytics />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
