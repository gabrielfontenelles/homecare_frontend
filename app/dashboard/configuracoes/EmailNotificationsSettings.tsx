"use client"
import React from "react"
import { Button } from "@/components/ui/button"

export default function EmailNotificationsSettings() {
  return (
    <section className="mb-8 p-6 rounded-lg border bg-card">
      <h2 className="text-xl font-bold mb-1">Notificações por e-mail</h2>
      <p className="text-muted-foreground mb-4">Gerencie quais notificações você deseja receber por e-mail.</p>
      <form className="space-y-3">
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-primary" /> Agendamentos
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-primary" /> Pacientes
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-primary" /> Lembretes
          </label>
        </div>
        <Button type="submit">Salvar preferências</Button>
      </form>
    </section>
  )
} 