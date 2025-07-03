

import type { Metadata } from "next"
import EmailNotificationsSettings from "./EmailNotificationsSettings"
import UserManagement from "./UserManagement"
import DataExport from "./DataExport"
import AccessPermissions from "./AccessPermissions"

export const metadata: Metadata = {
  title: "Configurações | HomeCare Coop",
  description: "Configurações do sistema HomeCare Coop",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>
      <EmailNotificationsSettings />
      <UserManagement />
      <DataExport />
      <AccessPermissions />
    </div>
  )
} 