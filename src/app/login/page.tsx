"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/layout/container";
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useLoginAs, useUsers } from "@/hooks/use-auth";
import type { User } from "@/types";

const ROLE_HINT: Record<User["role"], string> = {
  participant: "Acessa o dashboard do aluno, seminários matriculados e certificados.",
  coordinator: "Gerencia os próprios seminários, adiciona participantes e acompanha frequência.",
  super_admin: "Acesso total: gerencia coordenadores, emite certificados, consulta auditoria.",
};

const ROLE_LABEL: Record<User["role"], string> = {
  participant: "Participante",
  coordinator: "Coordenador",
  super_admin: "Super Admin",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-16">
        <Container className="max-w-4xl">
          <div className="text-center mb-10">
            <span className="caption text-text-light">Ambiente de demonstração</span>
            <h1 className="heading-lg text-text mt-1">Entrar como um usuário simulado</h1>
            <p className="body-lg text-text-light max-w-2xl mx-auto mt-3">
              Esta é a Fase 1 do MVP: ainda não há autenticação real. Escolha um dos usuários seed para visualizar a
              plataforma sob a perspectiva de cada papel.
            </p>
          </div>
          <React.Suspense fallback={<div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>}>
            <LoginContent />
          </React.Suspense>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}

function LoginContent() {
  const { data: users, isLoading } = useUsers();
  const loginAs = useLoginAs();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [busy, setBusy] = React.useState<string | null>(null);

  const handleLogin = async (userId: string, role: User["role"]) => {
    setBusy(userId);
    try {
      await loginAs.mutateAsync(userId);
      const dest = role === "participant" ? (next === "/" ? "/dashboard" : next) : "/admin";
      router.push(dest);
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(users ?? []).map((u) => (
        <Card key={u.id} className="hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{getInitials(u.fullName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base">{u.fullName}</CardTitle>
                <CardDescription className="truncate">{u.email}</CardDescription>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <Badge variant="secondary">{ROLE_LABEL[u.role]}</Badge>
                  {u.coordinatorStatus === "suspended" && <Badge variant="warning">suspenso</Badge>}
                  {u.coordinatorStatus === "active" && <Badge variant="success">ativo</Badge>}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="body-sm text-text-light">{ROLE_HINT[u.role]}</p>
            <Button className="w-full" onClick={() => handleLogin(u.id, u.role)} loading={busy === u.id}>
              Entrar como {u.fullName.split(" ")[0]}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
