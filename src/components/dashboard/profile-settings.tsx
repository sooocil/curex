"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

type SettingKey =
  | "emailNotifications"
  | "smsNotifications"
  | "appointmentReminders"
  | "testResultAlerts"
  | "marketingEmails"
  | "twoFactorAuth"
  | "dataSharing"

type Settings = Record<SettingKey, boolean>

export function ProfileSettings() {
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    testResultAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
    dataSharing: true,
  })

  const handleToggle = (setting: SettingKey) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handleSavePassword = () => {
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle("emailNotifications")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
            </div>
            <Switch
              id="smsNotifications"
              checked={settings.smsNotifications}
              onCheckedChange={() => handleToggle("smsNotifications")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
              <p className="text-sm text-muted-foreground">Receive reminders about upcoming appointments</p>
            </div>
            <Switch
              id="appointmentReminders"
              checked={settings.appointmentReminders}
              onCheckedChange={() => handleToggle("appointmentReminders")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="testResultAlerts">Test Result Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when new test results are available</p>
            </div>
            <Switch
              id="testResultAlerts"
              checked={settings.testResultAlerts}
              onCheckedChange={() => handleToggle("testResultAlerts")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketingEmails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive promotional emails and health tips</p>
            </div>
            <Switch
              id="marketingEmails"
              checked={settings.marketingEmails}
              onCheckedChange={() => handleToggle("marketingEmails")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch
              id="twoFactorAuth"
              checked={settings.twoFactorAuth}
              onCheckedChange={() => handleToggle("twoFactorAuth")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dataSharing">Data Sharing</Label>
              <p className="text-sm text-muted-foreground">
                Allow your data to be shared with your healthcare providers
              </p>
            </div>
            <Switch
              id="dataSharing"
              checked={settings.dataSharing}
              onCheckedChange={() => handleToggle("dataSharing")}
            />
          </div>
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button onClick={handleSavePassword} className="bg-curex hover:bg-curex-dark text-white">
                Update Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Export Your Data</h3>
            <p className="text-sm text-muted-foreground">Download a copy of your personal data</p>
            <Button variant="outline">Export Data</Button>
          </div>
          <div className="pt-4 border-t space-y-2">
            <h3 className="text-sm font-medium text-red-500">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all of your data</p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
