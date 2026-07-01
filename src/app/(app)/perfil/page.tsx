"use client";

import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { LogOut, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const ROLE_LABEL = {
  participant: "Participante",
  coordinator: "Coordenador",
  super_admin: "Super Admin",
} as const;

export default function ProfilePage() {
  const { data: user } = useCurrentUser();
  const router = useRouter();
  const logout = useLogout();

  if (!user) return null;
  return (
    <Container className="max-w-3xl">
      <PageHeader title="Meu perfil" description="Informações da sua conta na plataforma." />
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl">{user.fullName}</CardTitle>
              <p className="body-md text-text-light flex items-center gap-1.5 mt-1">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <Badge variant="secondary">{ROLE_LABEL[user.role]}</Badge>
                {user.coordinatorStatus === "suspended" && <Badge variant="warning">Suspenso</Badge>}
                {user.coordinatorStatus === "active" && <Badge variant="success">Ativo</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              await logout.mutateAsync();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" /> Sair da conta
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
