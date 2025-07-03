"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calendar, ClipboardList, HelpCircle, Home, LayoutGrid, Settings, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center text-white">HC</div>
          <span className="font-bold text-lg">HomeCare Coop</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
              <Link href="/dashboard">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/pacientes"} tooltip="Pacientes">
              <Link href="/dashboard/pacientes">
                <Users className="h-5 w-5" />
                <span>Pacientes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/profissionais"} tooltip="Profissionais">
              <Link href="/dashboard/profissionais">
                <ClipboardList className="h-5 w-5" />
                <span>Profissionais</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/escalas"} tooltip="Escalas">
              <Link href="/dashboard/escalas">
                <LayoutGrid className="h-5 w-5" />
                <span>Escalas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/agendamentos"} tooltip="Agendamentos">
              <Link href="/dashboard/agendamentos">
                <Calendar className="h-5 w-5" />
                <span>Agendamentos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/relatorios"} tooltip="Relatórios">
              <Link href="/dashboard/relatorios">
                <BarChart3 className="h-5 w-5" />
                <span>Relatórios</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Configurações: só ADMIN ou COORDENADOR */}
          {user?.roles?.some(role => role === "ADMIN" || role === "COORDENADOR") && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard/configuracoes"} tooltip="Configurações">
                <Link href="/dashboard/configuracoes">
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 bg-muted/50"
          asChild
        >
          <Link href="/dashboard/ajuda">
            <HelpCircle className="h-5 w-5" />
            <span>Precisa de ajuda?</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
