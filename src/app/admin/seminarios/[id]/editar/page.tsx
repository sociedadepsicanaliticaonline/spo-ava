"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RHFInput, RHFSelect, RHFTextarea } from "@/components/forms/rhf-fields";
import { RhfForm } from "@/components/forms/rhf-form";
import { useCurrentUser, isSuspended } from "@/hooks/use-auth";
import { useSeminar, useUpdateSeminar } from "@/hooks/use-entities";
import { seminarSchema, type SeminarFormValues } from "@/lib/schemas";

export default function EditSeminarPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: seminar, isLoading } = useSeminar(params.id);
  const update = useUpdateSeminar();
  const [busy, setBusy] = useState(false);
  const suspended = isSuspended(user);

  if (isLoading) return <p className="text-text-light body-md">Carregando...</p>;
  if (!seminar) return <p>Seminário não encontrado.</p>;
  if (!user) return null;
  if (suspended) {
    return (
      <Card variant="surface" className="p-8 text-center">
        <p className="heading-sm text-text mb-1">Ação bloqueada</p>
        <p className="body-md text-text-light">Sua conta de coordenador está suspensa. A edição está desabilitada.</p>
      </Card>
    );
  }

  const onSubmit = async (values: SeminarFormValues) => {
    setBusy(true);
    try {
      await update.mutateAsync({
        id: seminar.id,
        patch: {
          title: values.title,
          description: values.description ?? "",
          area: values.area || null,
          startDate: values.startDate,
          endDate: values.endDate,
          status: values.status,
        },
        actor: user,
      });
      toast.success("Seminário atualizado");
      router.push(`/admin/seminarios/${seminar.id}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao atualizar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title={`Editar: ${seminar.title}`}
        description="Atualize os dados básicos do seminário."
        backHref={`/admin/seminarios/${seminar.id}`}
        backLabel="Voltar ao seminário"
      />
      <RhfForm
        schema={seminarSchema}
        defaultValues={{
          title: seminar.title,
          description: seminar.description ?? "",
          area: seminar.area ?? "",
          startDate: seminar.startDate.slice(0, 10),
          endDate: seminar.endDate.slice(0, 10),
          status: seminar.status === "archived" ? "published" : seminar.status,
        }}
        onSubmit={onSubmit}
        className="max-w-2xl"
      >
        <Card>
          <CardContent className="p-6 space-y-4">
            <RHFInput name="title" label="Título" required />
            <RHFTextarea name="description" label="Descrição" rows={4} />
            <RHFInput name="area" label="Área" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RHFInput name="startDate" label="Data de início" type="date" required />
              <RHFInput name="endDate" label="Data de término" type="date" required />
            </div>
            <RHFSelect
              name="status"
              label="Status"
              options={[
                { value: "draft", label: "Rascunho" },
                { value: "published", label: "Publicado" },
              ]}
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" loading={busy}>Salvar alterações</Button>
            </div>
          </CardContent>
        </Card>
      </RhfForm>
    </>
  );
}
