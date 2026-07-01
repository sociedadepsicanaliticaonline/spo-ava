"use client";

import { useParams } from "next/navigation";
import * as React from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Logo } from "@/components/ui/logo";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";
import {
  useEnrollmentsByUser,
  useSeminarBySlug,
  useSeminarProgress,
  useSeminarStructure,
} from "@/hooks/use-entities";
import { formatDate, formatDuration } from "@/lib/utils";
import { Play } from "lucide-react";
import Link from "next/link";

export default function SeminarPage() {
  const params = useParams<{ slug: string }>();
  const { data: user } = useCurrentUser();
  const { data: seminar, isLoading } = useSeminarBySlug(params.slug);
  const { data: structure } = useSeminarStructure(seminar?.id);
  const { data: progress } = useSeminarProgress(seminar?.id, user?.id);
  const { data: enrollments } = useEnrollmentsByUser(user?.id);
  const enrollment = (enrollments ?? []).find((e) => e.seminarId === seminar?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center"><Spinner size="lg" /></main>
      </div>
    );
  }
  if (!seminar) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">Seminário não encontrado.</main>
        <SiteFooter />
      </div>
    );
  }

  const totalDuration = (structure?.lessons ?? []).reduce((acc, l) => acc + (l.durationSeconds ?? 0), 0);
  const nextLesson = structure?.modules
    .flatMap((m) => m.lessons)
    .find((l) => !l.id);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-8 md:py-12">
        <section className="bg-primary-dark text-white py-12 md:py-16">
          <Container>
            <div className="mb-6">
              <Logo variant="dark" size="sm" />
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {seminar.area && <Badge variant="secondary" className="bg-white/10 text-white border border-white/20">{seminar.area}</Badge>}
              <Badge variant="outline" className="border-white/30 text-white/80">{seminar.status === "published" ? "Publicado" : seminar.status}</Badge>
            </div>
            <h1 className="heading-xl text-white mb-3">{seminar.title}</h1>
            <p className="body-lg text-white/70 max-w-3xl mb-6">{seminar.description}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 body-md text-white/70">
              <span>Início: <span className="text-white">{formatDate(seminar.startDate)}</span></span>
              <span>Término: <span className="text-white">{formatDate(seminar.endDate)}</span></span>
              <span>{seminar.totalLessons} aulas · {formatDuration(totalDuration)}</span>
              {seminar.coordinator && (
                <span className="flex items-center gap-2">
                  Coordenação:
                  <Avatar className="h-6 w-6 bg-white/20">
                    <AvatarFallback className="bg-white/20 text-white text-[10px]">{getInitials(seminar.coordinator.fullName)}</AvatarFallback>
                  </Avatar>
                  <span className="text-white">{seminar.coordinator.fullName}</span>
                </span>
              )}
            </div>
          </Container>
        </section>

        <Container className="mt-8 md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <PageHeader title="Conteúdo do seminário" description="Módulos e aulas disponíveis." className="mb-0" />
              {!structure || structure.modules.length === 0 ? (
                <EmptyState title="Conteúdo em construção" description="Em breve os módulos e aulas serão publicados." />
              ) : (
                <div className="space-y-4">
                  {structure.modules.map((module, idx) => (
                    <Card key={module.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="caption text-text-light">Módulo {idx + 1}</p>
                            <CardTitle className="text-lg mt-1">{module.title}</CardTitle>
                            {module.description && <p className="body-sm text-text-light mt-1.5">{module.description}</p>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="divide-y divide-border">
                          {module.lessons.map((lesson, lidx) => (
                            <li key={lesson.id} className="py-3 flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-surface text-primary-light flex items-center justify-center body-sm font-semibold shrink-0">
                                {lidx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="body-md text-text truncate">{lesson.title}</p>
                                {lesson.durationSeconds && <p className="caption text-text-light">{formatDuration(lesson.durationSeconds)}</p>}
                              </div>
                              {enrollment ? (
                                <Button asChild variant="ghost" size="sm">
                                  <Link href={`/seminarios/${seminar.slug}/aula/${lesson.id}`}>
                                    <Play className="h-4 w-4" /> Assistir
                                  </Link>
                                </Button>
                              ) : (
                                <Badge variant="outline">Bloqueado</Badge>
                              )}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-4">
              {enrollment ? (
                <Card variant="highlight" className="p-5">
                  <p className="caption text-text-light">Seu progresso</p>
                  <p className="heading-md text-text mt-1">{progress?.percent ?? 0}%</p>
                  <ProgressBar value={progress?.percent ?? 0} className="mt-3" />
                  <p className="body-sm text-text-light mt-3">
                    {progress?.completed ?? 0} de {progress?.total ?? 0} aulas concluídas
                  </p>
                  {progress?.percent === 100 && (
                    <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="body-sm text-green-800 font-medium">Parabéns! Você concluiu 100% das aulas.</p>
                      <p className="caption text-green-700 mt-1">O certificado será liberado após o término do seminário.</p>
                    </div>
                  )}
                </Card>
              ) : (
                <Card variant="surface" className="p-5">
                  <p className="heading-sm text-text mb-2">Inscrição</p>
                  <p className="body-sm text-text-light">
                    A inscrição é feita por convite do coordenador do seminário. Se você é associado e tem interesse,
                    entre em contato com a coordenação.
                  </p>
                </Card>
              )}
              <Card className="p-5">
                <p className="caption text-text-light">Coordenador(a)</p>
                {seminar.coordinator && (
                  <div className="flex items-center gap-3 mt-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(seminar.coordinator.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="body-md font-medium text-text">{seminar.coordinator.fullName}</p>
                      <p className="caption text-text-light">{seminar.coordinator.email}</p>
                    </div>
                  </div>
                )}
              </Card>
            </aside>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
