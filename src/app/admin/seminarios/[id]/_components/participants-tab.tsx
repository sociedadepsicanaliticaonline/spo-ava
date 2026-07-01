"use client";

import { Search, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FormInput } from "@/components/forms/form-fields";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useCurrentUser, isSuspended } from "@/hooks/use-auth";
import { useEnroll, useRemoveEnrollment } from "@/hooks/use-entities";
import { useUsers } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import type { EnrollmentWithUser } from "@/types";

export function ParticipantsTab({ seminarId, enrollments }: { seminarId: string; enrollments: EnrollmentWithUser[] }) {
  const { data: user } = useCurrentUser();
  const { data: allUsers } = useUsers();
  const enroll = useEnroll();
  const remove = useRemoveEnrollment();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const suspended = isSuspended(user);

  if (!user) return null;

  const available = (allUsers ?? []).filter(
    (u) => u.role === "participant" && !enrollments.find((e) => e.userId === u.id)
  );
  const filtered = available.filter(
    (u) => !query || u.fullName.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  );

  const onEnroll = async (userId: string) => {
    try {
      await enroll.mutateAsync({ userId, seminarId, actor: user });
      toast.success("Participante inscrito");
      setOpen(false);
      setQuery("");
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao inscrever");
    }
  };

  const onRemove = async (enrollmentId: string, name: string) => {
    if (!confirm(`Remover ${name} deste seminário?`)) return;
    try {
      await remove.mutateAsync({ enrollmentId, actor: user });
      toast.success("Participante removido");
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao remover");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="body-md text-text-light">Participantes matriculados neste seminário.</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={suspended}>
              <UserPlus className="h-4 w-4" /> Adicionar participante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Adicionar participante</DialogTitle></DialogHeader>
            <FormInput label="Buscar" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nome ou e-mail..." />
            <div className="max-h-72 overflow-y-auto -mx-1">
              {filtered.length === 0 ? (
                <p className="body-sm text-text-light text-center py-6">Nenhum participante disponível.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {filtered.map((u) => (
                    <li key={u.id} className="px-1 py-2 flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{getInitials(u.fullName)}</AvatarFallback></Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="body-sm font-medium text-text truncate">{u.fullName}</p>
                        <p className="caption text-text-light truncate">{u.email}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => onEnroll(u.id)} loading={enroll.isPending}>
                        <UserPlus className="h-4 w-4" /> Inscrever
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {enrollments.length === 0 ? (
        <EmptyState
          title="Nenhum participante"
          description="Adicione participantes manualmente para começar."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Matriculados ({enrollments.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {enrollments.map((e) => (
                <li key={e.id} className="px-5 py-3 flex items-center gap-3">
                  <Avatar className="h-9 w-9"><AvatarFallback>{getInitials(e.user.fullName)}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="body-sm font-medium text-text truncate">{e.user.fullName}</p>
                    <p className="caption text-text-light truncate">{e.user.email}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ProgressBar value={e.attendance.percentComplete} className="flex-1 max-w-[200px]" size="sm" />
                      <span className="caption text-text-light whitespace-nowrap">{e.attendance.completedLessons}/{e.attendance.totalLessons} · {e.attendance.percentComplete}%</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className="caption text-text-light">Inscrito em {formatDate(e.enrolledAt)}</span>
                    <Badge variant="success">Ativo</Badge>
                  </div>
                  <Button variant="ghost" size="icon-sm" disabled={suspended} onClick={() => onRemove(e.id, e.user.fullName)}>
                    <X className="h-4 w-4" />
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
