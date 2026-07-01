"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/utils";
import type { ModuleWithLessons, SeminarWithMeta } from "@/types";
import { BarChart3, BookOpen, GraduationCap, Users } from "lucide-react";

export function SeminarOverview({ seminar, structure }: { seminar: SeminarWithMeta; structure?: { modules: ModuleWithLessons[]; lessons: any[] } }) {
  const totalDuration = (structure?.lessons ?? []).reduce((acc: number, l: any) => acc + (l.durationSeconds ?? 0), 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="surface" className="p-5">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <p className="caption text-text-light">Aulas</p>
              <p className="heading-md text-text">{seminar.totalLessons}</p>
            </div>
          </div>
        </Card>
        <Card variant="surface" className="p-5">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <div>
              <p className="caption text-text-light">Carga horária</p>
              <p className="heading-md text-text">{formatDuration(totalDuration)}</p>
            </div>
          </div>
        </Card>
        <Card variant="surface" className="p-5">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="caption text-text-light">Participantes</p>
              <p className="heading-md text-text">{seminar.enrolledCount}</p>
            </div>
          </div>
        </Card>
        <Card variant="surface" className="p-5">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <div>
              <p className="caption text-text-light">Módulos</p>
              <p className="heading-md text-text">{structure?.modules.length ?? 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg">Dados do seminário</CardTitle>
            <Badge variant={seminar.status === "published" ? "success" : seminar.status === "draft" ? "warning" : "outline"}>
              {seminar.status === "published" ? "Publicado" : seminar.status === "draft" ? "Rascunho" : "Arquivado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 body-md">
          <p><span className="text-text-light">Início:</span> <span className="text-text">{formatDate(seminar.startDate)}</span></p>
          <p><span className="text-text-light">Término:</span> <span className="text-text">{formatDate(seminar.endDate)}</span></p>
          {seminar.area && <p><span className="text-text-light">Área:</span> <span className="text-text">{seminar.area}</span></p>}
          {seminar.coordinator && (
            <p><span className="text-text-light">Coordenador:</span> <span className="text-text">{seminar.coordinator.fullName}</span></p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
