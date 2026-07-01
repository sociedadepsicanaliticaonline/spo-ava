"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RHFInput, RHFSelect, RHFTextarea } from "@/components/forms/rhf-fields";
import { RhfForm } from "@/components/forms/rhf-form";
import { useCurrentUser, isSuspended } from "@/hooks/use-auth";
import { useCreateSeminar } from "@/hooks/use-entities";
import { seminarSchema, type SeminarFormValues } from "@/lib/schemas";

export default function NewSeminarPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const create = useCreateSeminar();
  const [busy, setBusy] = useState(false);
  const suspended = isSuspended(user);

  if (!user) return null;
  if (suspended) {
    return (
      <Card variant="surface" className="p-8 text-center">
        <p className="heading-sm text-text mb-1">Ação bloqueada</p>
        <p className="body-md text-text-light">Sua conta de coordenador está suspensa. A criação de seminários está desabilitada.</p>
      </Card>
    );
  }

  const onSubmit = async (values: SeminarFormValues) => {
    setBusy(true);
    try {
      const created = await create.mutateAsync({
        input: {
          title: values.title,
          description: values.description ?? "",
          area: values.area || null,
          startDate: values.startDate,
          endDate: values.endDate,
          status: values.status,
          coordinatorId: user.id,
          maxSeats: null,
          coverImageUrl: null,
        },
        actor: user,
      });
      toast.success("Seminário criado");
      router.push(`/admin/seminarios/${created.id}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao criar seminário");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Novo seminário"
        description="Configure os dados básicos. Módulos e aulas são adicionados depois."
        backHref="/admin/seminarios"
        backLabel="Voltar para seminários"
      />
      <RhfForm
        schema={seminarSchema}
        defaultValues={{ title: "", description: "", area: "", startDate: "", endDate: "", status: "draft" }}
        onSubmit={onSubmit}
        className="max-w-2xl"
      >
        <Card>
          <CardContent className="p-6 space-y-4">
            <RHFInput name="title" label="Título" required placeholder="Ex.: Clínica do Contemporâneo" />
            <RHFTextarea name="description" label="Descrição" rows={4} placeholder="Sobre o que é o seminário..." />
            <RHFInput name="area" label="Área" placeholder="Ex.: Clínica, Teoria, Cultura" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RHFInput name="startDate" label="Data de início" type="date" required />
              <RHFInput name="endDate" label="Data de término" type="date" required description="Obrigatória: gatilho da certificação." />
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
              <Button type="submit" loading={busy}>Criar seminário</Button>
            </div>
          </CardContent>
        </Card>
      </RhfForm>
    </>
  );
}
