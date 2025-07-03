import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { SidebarInset } from "@/components/ui/sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 min-h-screen w-full">
          <div className="flex flex-col min-h-screen w-full">
            <Header />
            <main className="flex-1 p-6 w-full">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </ProtectedRoute>
  )
}
