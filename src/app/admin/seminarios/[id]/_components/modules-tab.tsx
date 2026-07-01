"use client";

import { BookOpen, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FormInput, FormTextarea } from "@/components/forms/form-fields";
import { RhfForm } from "@/components/forms/rhf-form";
import { RHFInput, RHFTextarea } from "@/components/forms/rhf-fields";
import { SortableList } from "@/components/ui/sortable-list";
import { useCurrentUser, isSuspended } from "@/hooks/use-auth";
import {
  useCreateLesson,
  useCreateModule,
  useRemoveLesson,
  useRemoveModule,
  useUpdateModule,
} from "@/hooks/use-entities";
import { extractYouTubeId, formatDuration } from "@/lib/utils";
import { moduleSchema, lessonSchema, type LessonFormValues, type ModuleFormValues } from "@/lib/schemas";
import type { ModuleWithLessons } from "@/types";
import { useServices } from "@/services/provider";

export function ModulesTab({ seminarId, structure }: { seminarId: string; structure?: { modules: ModuleWithLessons[]; lessons: any[] } }) {
  const services = useServices();
  const { data: user } = useCurrentUser();
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const removeModule = useRemoveModule();
  const createLesson = useCreateLesson();
  const removeLesson = useRemoveLesson();
  const [newModuleOpen, setNewModuleOpen] = useState(false);
  const [newLessonFor, setNewLessonFor] = useState<string | null>(null);
  const [optimisticOrder, setOptimisticOrder] = useState<string[]>([]);
  const suspended = isSuspended(user);

  if (!user) return null;
  const modules = structure?.modules ?? [];

  const handleReorderModules = async (orderedIds: string[]) => {
    setOptimisticOrder(orderedIds);
    try {
      await services.modules.reorder(seminarId, orderedIds, user);
      toast.success("Ordem atualizada");
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
      setOptimisticOrder([]);
    }
  };

  const handleReorderLessons = async (moduleId: string, orderedIds: string[]) => {
    try {
      await services.lessons.reorder(moduleId, orderedIds, user);
      toast.success("Ordem das aulas atualizada");
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
    }
  };

  const onCreateModule = async (values: ModuleFormValues) => {
    await createModule.mutateAsync({
      input: {
        seminarId,
        title: values.title,
        description: values.description || null,
        orderIndex: modules.length + 1,
      },
      actor: user,
    });
    setNewModuleOpen(false);
    toast.success("Módulo criado");
  };

  const onCreateLesson = async (moduleId: string, orderIndex: number, values: LessonFormValues) => {
    const videoId = extractYouTubeId(values.youtubeUrl);
    if (!videoId) {
      toast.error("URL do YouTube inválida");
      return;
    }
    await createLesson.mutateAsync({
      input: {
        moduleId,
        seminarId,
        title: values.title,
        description: values.description || null,
        youtubeUrl: values.youtubeUrl,
        youtubeVideoId: videoId,
        durationSeconds: null,
        orderIndex,
      },
      actor: user,
    });
    setNewLessonFor(null);
    toast.success("Aula criada");
  };

  const onDeleteModule = async (id: string, title: string) => {
    if (!confirm(`Excluir o módulo "${title}"? As aulas também serão removidas.`)) return;
    try {
      await removeModule.mutateAsync({ id, actor: user });
      toast.success("Módulo removido");
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
    }
  };

  const onDeleteLesson = async (id: string, title: string) => {
    if (!confirm(`Excluir a aula "${title}"?`)) return;
    try {
      await removeLesson.mutateAsync({ id, actor: user });
      toast.success("Aula removida");
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="body-md text-text-light">Arraste para reordenar. Crie módulos e adicione aulas a cada um.</p>
        <Dialog open={newModuleOpen} onOpenChange={setNewModuleOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={suspended}><Plus className="h-4 w-4" /> Novo módulo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo módulo</DialogTitle>
            </DialogHeader>
            <RhfForm
              schema={moduleSchema}
              defaultValues={{ title: "", description: "" }}
              onSubmit={onCreateModule}
            >
              <div className="space-y-3">
                <RHFInput name="title" label="Título" required placeholder="Ex.: Módulo 1 — Introdução" />
                <RHFTextarea name="description" label="Descrição" rows={3} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setNewModuleOpen(false)}>Cancelar</Button>
                  <Button type="submit" loading={createModule.isPending}>Criar módulo</Button>
                </div>
              </div>
            </RhfForm>
          </DialogContent>
        </Dialog>
      </div>

      {modules.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="Nenhum módulo ainda"
          description="Crie o primeiro módulo para começar a adicionar aulas."
        />
      ) : (
        <SortableList
          items={optimisticOrder.length ? modules.map((m) => ({ id: m.id, _order: optimisticOrder.indexOf(m.id) })).sort((a, b) => a._order - b._order).map((m) => ({ id: m.id })) : modules.map((m) => ({ id: m.id }))}
          onReorder={handleReorderModules}
          disabled={suspended}
          renderItem={(item) => {
            const m = modules.find((x) => x.id === item.id)!;
            const idx = modules.findIndex((x) => x.id === item.id);
            return (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="caption text-text-light">Módulo {idx + 1}</p>
                      <CardTitle className="text-lg mt-1">{m.title}</CardTitle>
                      {m.description && <CardDescription className="mt-1">{m.description}</CardDescription>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Dialog open={newLessonFor === m.id} onOpenChange={(o) => setNewLessonFor(o ? m.id : null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" disabled={suspended}><Plus className="h-4 w-4" /> Nova aula</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Nova aula em {m.title}</DialogTitle></DialogHeader>
                          <RhfForm
                            schema={lessonSchema}
                            defaultValues={{ title: "", youtubeUrl: "", description: "" }}
                            onSubmit={(values) => onCreateLesson(m.id, m.lessons.length + 1, values)}
                          >
                            <div className="space-y-3">
                              <RHFInput name="title" label="Título" required />
                              <RHFInput name="youtubeUrl" label="URL do YouTube" required placeholder="https://www.youtube.com/watch?v=..." />
                              <RHFTextarea name="description" label="Descrição" rows={2} />
                              <div className="flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setNewLessonFor(null)}>Cancelar</Button>
                                <Button type="submit" loading={createLesson.isPending}>Criar aula</Button>
                              </div>
                            </div>
                          </RhfForm>
                        </DialogContent>
                      </Dialog>
                      <Button size="icon-sm" variant="ghost" disabled={suspended} onClick={() => onDeleteModule(m.id, m.title)}>
                        <Trash2 className="h-4 w-4 text-accent" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {m.lessons.length === 0 ? (
                    <p className="body-sm text-text-light py-4">Nenhuma aula neste módulo.</p>
                  ) : (
                    <SortableList
                      items={m.lessons.map((l) => ({ id: l.id }))}
                      onReorder={(ids) => handleReorderLessons(m.id, ids)}
                      disabled={suspended}
                      renderItem={(item) => {
                        const lesson = m.lessons.find((l) => l.id === item.id)!;
                        const lidx = m.lessons.findIndex((l) => l.id === item.id);
                        return (
                          <div className="rounded-lg border border-border bg-white p-3 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-surface text-primary-light flex items-center justify-center body-sm font-semibold shrink-0">
                              {lidx + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="body-md text-text truncate">{lesson.title}</p>
                              <p className="caption text-text-light font-mono">{lesson.youtubeVideoId}</p>
                            </div>
                            {lesson.durationSeconds && <Badge variant="outline">{formatDuration(lesson.durationSeconds)}</Badge>}
                            <Button size="icon-sm" variant="ghost" disabled={suspended} onClick={() => onDeleteLesson(lesson.id, lesson.title)}>
                              <X className="h-4 w-4 text-accent" />
                            </Button>
                          </div>
                        );
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            );
          }}
        />
      )}
    </div>
  );
}
