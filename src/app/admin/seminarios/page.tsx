"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { useCurrentUser } from "@/hooks/use-auth";
import { useSeminars } from "@/hooks/use-entities";
import { formatDate } from "@/lib/utils";
import type { SeminarWithMeta } from "@/types";

export default function AdminSeminarsPage() {
  const { data: user } = useCurrentUser();
  const { data: seminars, isLoading } = useSeminars(
    user?.role === "super_admin" ? undefined : { coordinatorId: user?.id }
  );

  const columns: DataTableColumn<SeminarWithMeta>[] = [
    {
      key: "title",
      header: "Seminário",
      sortable: true,
      sortValue: (s) => s.title,
      cell: (s) => (
        <div>
          <p className="font-medium text-text">{s.title}</p>
          <p className="caption text-text-light line-clamp-1">{s.description}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (s) => s.status,
      cell: (s) => (
        <Badge variant={s.status === "published" ? "success" : s.status === "draft" ? "warning" : "outline"}>
          {s.status === "published" ? "Publicado" : s.status === "draft" ? "Rascunho" : "Arquivado"}
        </Badge>
      ),
    },
    {
      key: "area",
      header: "Área",
      sortable: true,
      sortValue: (s) => s.area ?? "",
      cell: (s) => (s.area ? <Badge variant="outline">{s.area}</Badge> : <span className="text-text-light">—</span>),
    },
    {
      key: "lessons",
      header: "Aulas",
      sortable: true,
      align: "right",
      sortValue: (s) => s.totalLessons,
      cell: (s) => <span className="text-text-light">{s.totalLessons}</span>,
    },
    {
      key: "enrolled",
      header: "Participantes",
      sortable: true,
      align: "right",
      sortValue: (s) => s.enrolledCount,
      cell: (s) => <span className="text-text-light">{s.enrolledCount}</span>,
    },
    {
      key: "end",
      header: "Término",
      sortable: true,
      sortValue: (s) => s.endDate,
      cell: (s) => <span className="text-text-light">{formatDate(s.endDate)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (s) => (
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/seminarios/${s.id}`}>Abrir</Link>
        </Button>
      ),
    },
  ];

  if (isLoading) return null;
  return (
    <>
      <PageHeader
        title="Seminários"
        description="Lista de seminários que você gerencia."
        action={
          <Button asChild>
            <Link href="/admin/seminarios/novo">
              <Plus className="h-4 w-4" /> Novo seminário
            </Link>
          </Button>
        }
      />
      <DataTable
        items={seminars ?? []}
        columns={columns}
        keyExtractor={(s) => s.id}
        searchPlaceholder="Buscar por título ou descrição..."
        searchFilter={(s, q) => s.title.toLowerCase().includes(q) || (s.description ?? "").toLowerCase().includes(q)}
        initialSort={{ key: "end", dir: "desc" }}
        emptyTitle="Nenhum seminário"
        emptyDescription="Crie um seminário para começar a adicionar módulos, aulas e participantes."
        emptyAction={
          <Button asChild>
            <Link href="/admin/seminarios/novo">Criar seminário</Link>
          </Button>
        }
      />
    </>
  );
}
