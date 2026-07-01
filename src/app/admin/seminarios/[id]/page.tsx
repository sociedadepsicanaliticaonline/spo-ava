"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Edit, Send, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser, isSuspended } from "@/hooks/use-auth";
import {
  useEnrollmentsBySeminar,
  usePublishSeminar,
  useRemoveSeminar,
  useSeminar,
  useSeminarStructure,
} from "@/hooks/use-entities";
import { SeminarOverview } from "./_components/overview";
import { ModulesTab } from "./_components/modules-tab";
import { ParticipantsTab } from "./_components/participants-tab";
import { FrequencyTab } from "./_components/frequency-tab";
import { MaterialsTab } from "./_components/materials-tab";

export default function AdminSeminarDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: seminar, isLoading } = useSeminar(params.id);
  const { data: structure } = useSeminarStructure(params.id);
  const { data: enrollments } = useEnrollmentsBySeminar(params.id);
  const publish = usePublishSeminar();
  const remove = useRemoveSeminar();
  const suspended = isSuspended(user);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!seminar) return <p>Seminário não encontrado.</p>;
  if (!user) return null;

  const onPublish = async () => {
    try {
      await publish.mutateAsync({ id: seminar.id, actor: user });
      toast.success("Seminário publicado");
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
    }
  };

  const onDelete = async () => {
    if (!confirm(`Excluir definitivamente o seminário "${seminar.title}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await remove.mutateAsync({ id: seminar.id, actor: user });
      toast.success("Seminário excluído");
      router.push("/admin/seminarios");
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
    }
  };

  return (
    <>
      <PageHeader
        title={seminar.title}
        description={seminar.description}
        backHref="/admin/seminarios"
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" disabled={suspended}>
              <a href={`/admin/seminarios/${seminar.id}/editar`}><Edit className="h-4 w-4" /> Editar</a>
            </Button>
            {seminar.status === "draft" && (
              <Button size="sm" onClick={onPublish} loading={publish.isPending} disabled={suspended}>
                <Send className="h-4 w-4" /> Publicar
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={onDelete} disabled={suspended} className="text-accent hover:bg-accent/5">
              <Trash2 className="h-4 w-4" /> Excluir
            </Button>
          </div>
        }
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="modules">Módulos e aulas</TabsTrigger>
          <TabsTrigger value="participants">Participantes ({enrollments?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="frequency">Frequência</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <SeminarOverview seminar={seminar} structure={structure} />
        </TabsContent>
        <TabsContent value="modules">
          <ModulesTab seminarId={seminar.id} structure={structure} />
        </TabsContent>
        <TabsContent value="participants">
          <ParticipantsTab seminarId={seminar.id} enrollments={enrollments ?? []} />
        </TabsContent>
        <TabsContent value="frequency">
          <FrequencyTab seminarId={seminar.id} />
        </TabsContent>
        <TabsContent value="materials">
          <MaterialsTab seminarId={seminar.id} />
        </TabsContent>
      </Tabs>
    </>
  );
}
