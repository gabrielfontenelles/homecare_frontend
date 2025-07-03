"use client"

import React from "react"

export default function DataExport() {
  return (
    <section className="mb-8 p-6 rounded-lg border bg-card">
      <h2 className="text-xl font-bold mb-1">Exportação de dados</h2>
      <p className="text-muted-foreground mb-4">Exporte os dados do sistema para análise ou backup.</p>
      <div className="flex flex-wrap gap-3">
        <button className="btn btn-outline">Exportar pacientes</button>
        <button className="btn btn-outline">Exportar profissionais</button>
        <button className="btn btn-outline">Exportar agendamentos</button>
      </div>
    </section>
  )
} 