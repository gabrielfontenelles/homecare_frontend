import type { Metadata } from "next"
import { UserProfile } from "@/components/user-profile"

export const metadata: Metadata = {
  title: "Perfil | HomeCare Coop",
  description: "Perfil do usuário no sistema HomeCare Coop",
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">Visualize e edite suas informações pessoais</p>
      </div>
      <UserProfile />
    </div>
  )
}
