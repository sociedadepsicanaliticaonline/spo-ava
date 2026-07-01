"use client";

import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spinner } from "@/components/ui/spinner";
import { useSeminarOverview } from "@/hooks/use-entities";

export function FrequencyTab({ seminarId }: { seminarId: string }) {
  const { data, isLoading } = useSeminarOverview(seminarId);
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!data || data.length === 0) {
    return <EmptyState title="Sem dados" description="Nenhum participante matriculado ainda." />;
  }
  const avg = Math.round(data.reduce((acc, d) => acc + d.percent, 0) / data.length);
  return (
    <div className="space-y-4">
      <Card variant="surface" className="p-5">
        <p className="caption text-text-light">Frequência média do seminário</p>
        <p className="heading-lg text-text mt-1">{avg}%</p>
        <p className="body-sm text-text-light">{data.length} participantes computados</p>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progresso por participante</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {[...data].sort((a, b) => b.percent - a.percent).map((d) => (
              <li key={d.user.id} className="px-5 py-3 flex items-center gap-3">
                <Avatar className="h-9 w-9"><AvatarFallback>{getInitials(d.user.fullName)}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="body-sm font-medium text-text truncate">{d.user.fullName}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <ProgressBar value={d.percent} className="flex-1" size="sm" />
                    <span className="caption text-text-light whitespace-nowrap">{d.completed}/{d.total} · {d.percent}%</span>
                  </div>
                </div>
                <Badge variant={d.percent === 100 ? "success" : d.percent >= 50 ? "secondary" : "warning"}>
                  {d.percent === 100 ? "Concluído" : d.percent >= 50 ? "Em andamento" : "Iniciando"}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
