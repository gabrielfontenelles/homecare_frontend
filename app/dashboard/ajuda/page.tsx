import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Ajuda | HomeCare Coop",
  description: "Central de ajuda do sistema HomeCare Coop",
}

export default function HelpPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Central de Ajuda</h1>
        <p className="text-muted-foreground">Encontre respostas para suas dúvidas e aprenda a usar o sistema</p>
      </div>

      <Tabs defaultValue="faq" className="flex-1">
        <TabsList>
          <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
          <TabsTrigger value="guides">Guias de Uso</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>
                Respostas para as dúvidas mais comuns sobre o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Como cadastrar um novo paciente?</AccordionTrigger>
                  <AccordionContent>
                    Para cadastrar um novo paciente, acesse a seção "Pacientes" no menu lateral e clique no botão
                    "Novo Paciente". Preencha todos os campos obrigatórios do formulário e clique em "Salvar".
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Como agendar uma visita?</AccordionTrigger>
                  <AccordionContent>
                    Vá até a seção "Agendamentos", clique em "Novo Agendamento". Selecione o paciente,
                    o profissional, a data e horário desejados. Confirme os detalhes e salve o agendamento.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Como gerar relatórios?</AccordionTrigger>
                  <AccordionContent>
                    Na seção "Relatórios", você encontrará diferentes tipos de relatórios disponíveis.
                    Selecione o tipo desejado, defina os filtros necessários e clique em "Gerar Relatório".
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Como gerenciar as escalas dos profissionais?</AccordionTrigger>
                  <AccordionContent>
                    Acesse a seção "Escalas", onde você poderá visualizar e gerenciar as escalas de todos os
                    profissionais. É possível filtrar por data, profissional e criar novas escalas.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Primeiros Passos</CardTitle>
                <CardDescription>
                  Guia básico para começar a usar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Configuração Inicial</h3>
                  <p className="text-sm text-muted-foreground">
                    Comece configurando seu perfil e as preferências básicas do sistema.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">2. Cadastro de Profissionais</h3>
                  <p className="text-sm text-muted-foreground">
                    Cadastre os profissionais que farão parte da sua equipe.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">3. Cadastro de Pacientes</h3>
                  <p className="text-sm text-muted-foreground">
                    Adicione os pacientes que serão atendidos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestão de Atendimentos</CardTitle>
                <CardDescription>
                  Como gerenciar os atendimentos no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Agendamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Aprenda a criar e gerenciar agendamentos de forma eficiente.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">2. Escalas</h3>
                  <p className="text-sm text-muted-foreground">
                    Como organizar as escalas dos profissionais.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">3. Relatórios</h3>
                  <p className="text-sm text-muted-foreground">
                    Gere e analise relatórios para melhor gestão.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 