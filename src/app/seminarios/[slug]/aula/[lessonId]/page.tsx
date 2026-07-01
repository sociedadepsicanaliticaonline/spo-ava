"use client";

import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/layout/container";
import { YouTubePlayer } from "@/components/player/youtube-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";
import { useLesson, useSeminarStructure, useSettings, useUpsertProgress } from "@/hooks/use-entities";
import { CheckCircle2, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { toast } from "sonner";

export default function LessonPage() {
  const params = useParams<{ slug: string; lessonId: string }>();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: lesson, isLoading } = useLesson(params.lessonId, user?.id);
  const { data: structure } = useSeminarStructure(lesson?.seminarId);
  const upsert = useUpsertProgress();
  const { data: settings } = useSettings();
  const thresholdSetting = settings?.find((s) => s.key === "completion_threshold_percent");
  const threshold = typeof thresholdSetting?.value === "number" ? thresholdSetting.value : 95;

  const allLessons = React.useMemo(
    () => (structure?.modules ?? []).flatMap((m) => m.lessons).sort((a, b) => a.orderIndex - b.orderIndex),
    [structure]
  );
  const idx = allLessons.findIndex((l) => l.id === params.lessonId);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  const [maxWatched, setMaxWatched] = React.useState(0);
  const lastSavedAt = React.useRef(0);

  React.useEffect(() => {
    if (lesson?.progress) setMaxWatched(lesson.progress.maxWatchedPercent);
    else setMaxWatched(0);
  }, [lesson?.id]);

  const saveProgress = React.useCallback(
    async (percent: number, completed = false) => {
      if (!user || !lesson) return;
      try {
        await upsert.mutateAsync({
          input: {
            userId: user.id,
            lessonId: lesson.id,
            seminarId: lesson.seminarId,
            maxWatchedPercent: percent,
            completed,
          },
          actor: user,
        });
      } catch (err) {
        console.error("Erro ao salvar progresso:", err);
      }
    },
    [user, lesson?.id, lesson?.seminarId]
  );

  const handleProgress = React.useCallback(
    (current: number, total: number, percent: number) => {
      setMaxWatched((prev) => Math.max(prev, percent));
      const now = Date.now();
      if (now - lastSavedAt.current < 5000) return;
      lastSavedAt.current = now;
      saveProgress(Math.max(maxWatched, percent));
    },
    [maxWatched, saveProgress]
  );

  const handleEnded = React.useCallback(() => {
    if (!user || !lesson) return;
    saveProgress(100, true);
    toast.success("Aula concluída!");
  }, [user, lesson?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center"><Spinner size="lg" /></main>
      </div>
    );
  }
  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">Aula não encontrada.</main>
        <SiteFooter />
      </div>
    );
  }

  const isCompleted = (lesson.progress?.completed ?? false) || maxWatched >= threshold;

  const markComplete = async () => {
    setMaxWatched(100);
    await saveProgress(100, true);
    toast.success("Aula marcada como concluída");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-6 md:py-10">
        <Container className="max-w-5xl">
          <div className="mb-4 flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <a onClick={(e) => { e.preventDefault(); router.push(`/seminarios/${params.slug}`); }} className="cursor-pointer">
                <ChevronLeft className="h-4 w-4" /> Voltar ao seminário
              </a>
            </Button>
            <div className="body-sm text-text-light">
              Aula {idx + 1} de {allLessons.length}
            </div>
          </div>

          <YouTubePlayer
            videoId={lesson.youtubeVideoId}
            onProgress={handleProgress}
            onEnded={handleEnded}
            thresholdPercent={threshold}
          />

          <div className="flex flex-wrap items-start justify-between gap-3 mb-6 mt-4">
            <div>
              <h1 className="heading-lg text-text">{lesson.title}</h1>
              {lesson.description && <p className="body-md text-text-light mt-1">{lesson.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Concluída</Badge>
              ) : (
                <Button size="sm" variant="outline" onClick={markComplete} loading={upsert.isPending}>
                  Marcar como concluída
                </Button>
              )}
            </div>
          </div>

          <Card variant="surface" className="p-4 mb-6">
            <p className="caption text-text-light">Progresso desta aula</p>
            <div className="mt-2 h-2 w-full rounded-full bg-border overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${maxWatched}%` }} />
            </div>
            <p className="body-sm text-text mt-2">
              {Math.round(maxWatched)}% assistido · a aula é marcada como concluída a partir de {threshold}%.
            </p>
          </Card>

          <div className="flex items-center justify-between">
            {prev ? (
              <Button asChild variant="outline" size="sm">
                <a onClick={(e) => { e.preventDefault(); router.push(`/seminarios/${params.slug}/aula/${prev.id}`); }} className="cursor-pointer">
                  <ChevronLeft className="h-4 w-4" /> {prev.title}
                </a>
              </Button>
            ) : <div />}
            {next ? (
              <Button asChild size="sm">
                <a onClick={(e) => { e.preventDefault(); router.push(`/seminarios/${params.slug}/aula/${next.id}`); }} className="cursor-pointer">
                  {next.title} <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            ) : <div />}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-base">Materiais de apoio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 body-sm text-text-light">
                <FileText className="h-4 w-4" />
                Em breve os materiais complementares do seminário aparecerão aqui (PDFs, links, textos).
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
