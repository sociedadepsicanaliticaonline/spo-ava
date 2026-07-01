"use client";

import { FileText, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FormInput, FormSelect, FormTextarea } from "@/components/forms/form-fields";
import { useCurrentUser, isSuspended } from "@/hooks/use-auth";
import { useArticlesBySeminar, useCreateArticle, useRemoveArticle } from "@/hooks/use-entities";
import { articleSchema, type ArticleFormValues } from "@/lib/schemas";
import { RhfForm } from "@/components/forms/rhf-form";
import { RHFInput, RHFSelect, RHFTextarea } from "@/components/forms/rhf-fields";

export function MaterialsTab({ seminarId }: { seminarId: string }) {
  const { data: user } = useCurrentUser();
  const { data: articles, isLoading } = useArticlesBySeminar(seminarId);
  const create = useCreateArticle();
  const remove = useRemoveArticle();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const suspended = isSuspended(user);

  if (!user) return null;
  if (isLoading) return <p className="text-text-light body-md">Carregando...</p>;

  const onSubmit = async (values: ArticleFormValues) => {
    setBusy(true);
    try {
      await create.mutateAsync({
        input: {
          seminarId,
          title: values.title,
          description: values.description || null,
          fileUrl: values.fileUrl,
          fileType: values.fileType,
        },
        actor: user,
      });
      setOpen(false);
      toast.success("Material adicionado");
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
    } finally {
      setBusy(false);
    }
  };

  const onRemove = async (id: string, title: string) => {
    if (!confirm(`Remover "${title}"?`)) return;
    try {
      await remove.mutateAsync({ id, actor: user });
      toast.success("Material removido");
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="body-md text-text-light">Materiais de apoio disponíveis para os participantes (PDFs, links, etc.).</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={suspended}><Plus className="h-4 w-4" /> Novo material</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo material de apoio</DialogTitle></DialogHeader>
            <RhfForm
              schema={articleSchema}
              defaultValues={{ title: "", description: "", fileUrl: "", fileType: "pdf" }}
              onSubmit={onSubmit}
            >
              <div className="space-y-3">
                <RHFInput name="title" label="Título" required placeholder="Ex.: Bibliografia comentada" />
                <RHFTextarea name="description" label="Descrição" rows={2} />
                <RHFInput name="fileUrl" label="URL do arquivo" type="url" required placeholder="https://..." />
                <RHFSelect
                  name="fileType"
                  label="Tipo"
                  options={[
                    { value: "pdf", label: "PDF" },
                    { value: "docx", label: "DOCX" },
                    { value: "pptx", label: "PPTX" },
                    { value: "link", label: "Link externo" },
                  ]}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button type="submit" loading={busy}>Adicionar</Button>
                </div>
              </div>
            </RhfForm>
          </DialogContent>
        </Dialog>
      </div>

      {!articles || articles.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title="Nenhum material ainda"
          description="Adicione PDFs, links ou documentos para apoiar as aulas."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {articles.map((a) => (
                <li key={a.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="body-sm font-medium text-text truncate">{a.title}</p>
                    {a.description && <p className="caption text-text-light truncate">{a.description}</p>}
                    <p className="caption text-text-light font-mono truncate mt-0.5">{a.fileUrl}</p>
                  </div>
                  <Badge variant="outline" className="uppercase">{a.fileType}</Badge>
                  <Button asChild variant="ghost" size="sm">
                    <a href={a.fileUrl} target="_blank" rel="noreferrer">Abrir</a>
                  </Button>
                  <Button size="icon-sm" variant="ghost" disabled={suspended} onClick={() => onRemove(a.id, a.title)}>
                    <Trash2 className="h-4 w-4 text-accent" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
