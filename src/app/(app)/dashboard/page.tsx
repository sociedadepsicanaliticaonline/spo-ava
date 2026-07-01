"use client";

import { ArrowRight, Award, BookOpen, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";
import { useCertificatesByUser, useEnrollmentsByUser } from "@/hooks/use-entities";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data: user } = useCurrentUser();
  const { data: enrollments, isLoading } = useEnrollmentsByUser(user?.id);
  const { data: certificates } = useCertificatesByUser(user?.id);

  if (!user) return null;
  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  const active = (enrollments ?? []).filter((e) => e.status === "active");
  const completed = (active ?? []).filter((e) => e.attendance.percentComplete === 100);
  const inProgress = (active ?? []).filter((e) => e.attendance.percentComplete < 100);

  return (
    <Container>
      <PageHeader
        title={`Olá, ${user.fullName.split(" ")[0]}`}
        description="Acompanhe seus seminários em andamento, sua frequência e seus certificados."
        action={
          <Button asChild variant="outline">
            <Link href="/catalogo">
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Card variant="surface" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="caption text-text-light">Em andamento</p>
              <p className="heading-lg text-text mt-1">{inProgress.length}</p>
            </div>
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card variant="surface" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="caption text-text-light">Concluídos</p>
              <p className="heading-lg text-text mt-1">{completed.length}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card variant="surface" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="caption text-text-light">Certificados</p>
              <p className="heading-lg text-text mt-1">{certificates?.length ?? 0}</p>
            </div>
            <Award className="h-8 w-8 text-accent" />
          </div>
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="heading-md text-text mb-4">Meus seminários</h2>
        {active.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-12 w-12" />}
            title="Você ainda não está matriculado"
            description="A inscrição é feita por convite do coordenador do seminário."
            action={
              <Button asChild>
                <Link href="/catalogo">Explorar catálogo</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((e) => (
              <Card key={e.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant={e.attendance.percentComplete === 100 ? "success" : "secondary"}>
                      {e.attendance.percentComplete === 100 ? "Concluído" : "Em andamento"}
                    </Badge>
                    {e.seminar.area && <Badge variant="outline">{e.seminar.area}</Badge>}
                  </div>
                  <CardTitle className="text-lg">{e.seminar.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{e.seminar.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between body-sm mb-1.5">
                      <span className="text-text-light">Progresso</span>
                      <span className="text-text font-medium">
                        {e.attendance.completedLessons}/{e.attendance.totalLessons} aulas
                      </span>
                    </div>
                    <ProgressBar value={e.attendance.percentComplete} showLabel />
                  </div>
                  <div className="flex items-center justify-between text-body-sm text-text-light">
                    <span>Início: {formatDate(e.seminar.startDate)}</span>
                    <span>Término: {formatDate(e.seminar.endDate)}</span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/seminarios/${e.seminar.slug}`}>
                      {e.attendance.percentComplete === 0 ? "Iniciar seminário" : "Continuar"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-md text-text">Certificados</h2>
          <Button asChild variant="link" size="sm">
            <Link href="/certificados">Ver todos <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        {!certificates || certificates.length === 0 ? (
          <Card variant="surface" className="p-8 text-center text-text-light body-md">
            Você ainda não possui certificados. Eles serão liberados automaticamente após a conclusão dos seminários.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.slice(0, 3).map((c) => (
              <Card key={c.id} variant="surface" className="p-5">
                <Award className="h-8 w-8 text-accent mb-3" />
                <p className="heading-sm text-text line-clamp-2">{c.seminar.title}</p>
                <p className="body-sm text-text-light mt-1">Emitido em {formatDate(c.issuedAt)}</p>
                <p className="caption text-text-light mt-2 font-mono">{c.validationCode}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
