"use client";

import { Pause, Play, Plus, UserCog } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { RhfForm } from "@/components/forms/rhf-form";
import { RHFInput } from "@/components/forms/rhf-fields";
import { useCurrentUser, useUsers } from "@/hooks/use-auth";
import { useCreateUser, useLogAudit, useSetCoordinatorStatus } from "@/hooks/use-entities";
import { formatDate } from "@/lib/utils";
import { coordinatorSchema, type CoordinatorFormValues } from "@/lib/schemas";
import type { User } from "@/types";

export default function CoordinatorsPage() {
  const { data: user } = useCurrentUser();
  const { data: users } = useUsers();
  const setStatus = useSetCoordinatorStatus();
  const create = useCreateUser();
  const log = useLogAudit();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!user || user.role !== "super_admin") return null;
  const coordinators = (users ?? []).filter((u) => u.role === "coordinator");

  const onCreate = async (values: CoordinatorFormValues) => {
    setBusy(true);
    try {
      const created = await create.mutateAsync({
        input: { fullName: values.fullName, email: values.email, role: "coordinator", coordinatorStatus: "active" },
      });
      await log.mutateAsync({ action: "coordinator.created", actor: user, meta: { targetTable: "users", targetId: created.id, metadata: { nome: values.fullName } } });
      toast.success("Coordenador criado");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao criar");
    } finally {
      setBusy(false);
    }
  };

  const onToggle = async (id: string, current: User["coordinatorStatus"], fullName: string) => {
    const next: "active" | "suspended" = current === "active" ? "suspended" : "active";
    if (!confirm(`${next === "suspended" ? "Suspender" : "Reativar"} ${fullName}?`)) return;
    try {
      await setStatus.mutateAsync({ id, status: next, actor: user });
      await log.mutateAsync({
        action: next === "suspended" ? "coordinator.suspended" : "coordinator.reactivated",
        actor: user,
        meta: { targetTable: "users", targetId: id, metadata: { nome: fullName } },
      });
      toast.success(`Coordenador ${next === "suspended" ? "suspenso" : "reativado"}`);
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
    }
  };

  const columns: DataTableColumn<User>[] = [
    {
      key: "name",
      header: "Coordenador",
      sortable: true,
      sortValue: (u) => u.fullName,
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(u.fullName)}</AvatarFallback></Avatar>
          <div>
            <p className="font-medium text-text">{u.fullName}</p>
            <p className="caption text-text-light">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (u) => u.coordinatorStatus ?? "active",
      cell: (u) => (u.coordinatorStatus === "suspended" ? <Badge variant="warning">Suspenso</Badge> : <Badge variant="success">Ativo</Badge>),
    },
    {
      key: "created",
      header: "Criado em",
      sortable: true,
      sortValue: (u) => u.createdAt,
      cell: (u) => <span className="text-text-light">{formatDate(u.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (u) => (
        <Button variant="outline" size="sm" onClick={() => onToggle(u.id, u.coordinatorStatus, u.fullName)} loading={setStatus.isPending}>
          {u.coordinatorStatus === "suspended" ? <><Play className="h-4 w-4" /> Reativar</> : <><Pause className="h-4 w-4" /> Suspender</>}
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Coordenadores"
        description="Cadastre novos coordenadores ou suspenda contas existentes."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4" /> Novo coordenador</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo coordenador</DialogTitle></DialogHeader>
              <RhfForm schema={coordinatorSchema} defaultValues={{ fullName: "", email: "" }} onSubmit={onCreate}>
                <div className="space-y-3">
                  <RHFInput name="fullName" label="Nome completo" required />
                  <RHFInput name="email" label="E-mail" type="email" required />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button type="submit" loading={busy}>Cadastrar</Button>
                  </div>
                </div>
              </RhfForm>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        items={coordinators}
        columns={columns}
        keyExtractor={(u) => u.id}
        searchPlaceholder="Buscar por nome ou e-mail..."
        searchFilter={(u, q) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)}
        initialSort={{ key: "name", dir: "asc" }}
        emptyTitle="Nenhum coordenador"
        emptyDescription="Cadastre o primeiro coordenador para começar."
        emptyAction={
          <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Cadastrar coordenador</Button>
        }
      />
    </>
  );
}
