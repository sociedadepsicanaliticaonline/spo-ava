"use client";

import { Award, BookOpen, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";
import { useAuditLogs, useEnrollmentsBySeminar, useSeminars } from "@/hooks/use-entities";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { data: user } = useCurrentUser();
  const { data: seminars, isLoading } = useSeminars(
    user?.role === "super_admin" ? undefined : { coordinatorId: user?.id }
  );
  const { data: audit } = useAuditLogs();

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }
  if (!user) return null;

  const mySeminars = seminars ?? [];
  const totalEnrolled = mySeminars.reduce((acc, s) => acc + s.enrolledCount, 0);
  const totalLessons = mySeminars.reduce((acc, s) => acc + s.totalLessons, 0);

  return (
    <>
      <PageHeader
        title={user.role === "super_admin" ? "Painel administrativo" : "Meus seminários"}
        description={
          user.role === "super_admin"
            ? "Visão geral da plataforma, com seminários, coordenadores e auditoria recente."
            : "Visão geral dos seminários que você coordena."
        }
        action={
          (user.role === "coordinator" || user.role === "super_admin") && (
            <Button asChild>
              <Link href="/admin/seminarios/novo">Novo seminário</Link>
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card variant="surface" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="caption text-text-light">Seminários</p>
              <p className="heading-lg text-text mt-1">{mySeminars.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card variant="surface" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="caption text-text-light">Participantes</p>
              <p className="heading-lg text-text mt-1">{totalEnrolled}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card variant="surface" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="caption text-text-light">Aulas publicadas</p>
              <p className="heading-lg text-text mt-1">{totalLessons}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      <section className="mb-8">
        <h2 className="heading-md text-text mb-4">Seminários</h2>
        {mySeminars.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-12 w-12" />}
            title="Nenhum seminário ainda"
            description="Crie seu primeiro seminário para começar."
            action={<Button asChild><Link href="/admin/seminarios/novo">Criar seminário</Link></Button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mySeminars.map((s) => (
              <Card key={s.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={s.status === "published" ? "success" : s.status === "draft" ? "warning" : "outline"}>
                      {s.status === "published" ? "Publicado" : s.status === "draft" ? "Rascunho" : "Arquivado"}
                    </Badge>
                    {s.area && <Badge variant="outline">{s.area}</Badge>}
                  </div>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="body-sm text-text-light flex flex-wrap gap-x-4">
                    <span>{s.totalLessons} aulas</span>
                    <span>{s.enrolledCount} participantes</span>
                    <span>Término: {formatDate(s.endDate)}</span>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/admin/seminarios/${s.id}`}>Abrir seminário</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {user.role === "super_admin" && (
        <section>
          <h2 className="heading-md text-text mb-4">Atividade recente</h2>
          <Card variant="surface">
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {(audit ?? []).slice(0, 5).map((log) => (
                  <li key={log.id} className="px-5 py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="body-sm text-text">
                        <span className="font-medium">{log.actor?.fullName ?? "Sistema"}</span> · <code className="caption text-text-light">{log.action}</code>
                      </p>
                      {log.metadata && <p className="caption text-text-light truncate">{JSON.stringify(log.metadata)}</p>}
                    </div>
                    <span className="body-sm text-text-light shrink-0">{formatDate(log.createdAt, { withTime: true })}</span>
                  </li>
                ))}
                {(!audit || audit.length === 0) && (
                  <li className="px-5 py-6 text-center body-sm text-text-light">Nenhuma atividade registrada.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
}
