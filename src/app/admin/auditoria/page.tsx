"use client";

import { Shield } from "lucide-react";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";
import { useAuditLogs } from "@/hooks/use-entities";
import { formatDate } from "@/lib/utils";
import type { AuditLog, User } from "@/types";

const ACTION_LABEL: Record<string, { label: string; variant: "default" | "secondary" | "accent" | "outline" | "warning" | "success" | "error" }> = {
  "coordinator.created": { label: "Coordenador criado", variant: "success" },
  "coordinator.suspended": { label: "Coordenador suspenso", variant: "warning" },
  "coordinator.reactivated": { label: "Coordenador reativado", variant: "success" },
  "seminar.created": { label: "Seminário criado", variant: "secondary" },
  "seminar.published": { label: "Seminário publicado", variant: "success" },
  "certificate.issued_auto": { label: "Certificado (automático)", variant: "default" },
  "certificate.issued_manual": { label: "Certificado (manual)", variant: "accent" },
  "certificate.revoked": { label: "Certificado revogado", variant: "error" },
  "enrollment.created": { label: "Matrícula criada", variant: "secondary" },
  "settings.updated": { label: "Configuração alterada", variant: "outline" },
};

type Row = AuditLog & { actor?: User | null };

export default function AuditPage() {
  const { data: user } = useCurrentUser();
  const { data: logs, isLoading } = useAuditLogs();
  if (!user || user.role !== "super_admin") return null;
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!logs || logs.length === 0) return <EmptyState icon={<Shield className="h-12 w-12" />} title="Nenhum registro" />;

  const columns: DataTableColumn<Row>[] = [
    {
      key: "actor",
      header: "Ator",
      sortable: true,
      sortValue: (l) => l.actor?.fullName ?? "Sistema",
      cell: (l) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{l.actor ? getInitials(l.actor.fullName) : "—"}</AvatarFallback></Avatar>
          <span>{l.actor?.fullName ?? "Sistema"}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Ação",
      sortable: true,
      sortValue: (l) => l.action,
      cell: (l) => {
        const meta = ACTION_LABEL[l.action] ?? { label: l.action, variant: "outline" as const };
        return <Badge variant={meta.variant}>{meta.label}</Badge>;
      },
    },
    {
      key: "target",
      header: "Alvo",
      cell: (l) => l.targetTable ? <span className="caption font-mono text-text-light">{l.targetTable} · {l.targetId}</span> : <span className="text-text-light">—</span>,
    },
    {
      key: "metadata",
      header: "Metadados",
      cell: (l) => l.metadata ? <code className="caption text-text-light break-all">{JSON.stringify(l.metadata)}</code> : <span className="text-text-light">—</span>,
    },
    {
      key: "when",
      header: "Quando",
      sortable: true,
      sortValue: (l) => l.createdAt,
      cell: (l) => <span className="text-text-light whitespace-nowrap">{formatDate(l.createdAt, { withTime: true })}</span>,
    },
  ];

  return (
    <>
      <PageHeader title="Auditoria" description="Histórico de ações administrativas na plataforma." />
      <DataTable
        items={logs}
        columns={columns}
        keyExtractor={(l) => l.id}
        searchPlaceholder="Filtrar por ação, ator, alvo..."
        searchFilter={(l, q) => {
          const text = `${l.action} ${l.actor?.fullName ?? ""} ${l.targetTable ?? ""} ${l.targetId ?? ""}`.toLowerCase();
          return text.includes(q);
        }}
        initialSort={{ key: "when", dir: "desc" }}
      />
    </>
  );
}
