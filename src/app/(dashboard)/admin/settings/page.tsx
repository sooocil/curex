import { Metadata } from "next"
import SettingPageClient from "@/components/admin/settingPageClient"

export const metadata: Metadata = {
  title: "Settings | Curex Admin",
  description: "Manage platform preferences and system behaviors",
}

export default function SettingsPage() {
  return <SettingPageClient />
}
