"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSeminars } from "@/hooks/use-entities";
import { formatDate } from "@/lib/utils";
import type { Seminar } from "@/types";

function seminarState(s: Seminar) {
  const now = Date.now();
  const start = new Date(s.startDate).getTime();
  const end = new Date(s.endDate).getTime();
  if (s.status === "draft") return { label: "Em breve", variant: "outline" as const };
  if (s.status === "archived") return { label: "Arquivado", variant: "outline" as const };
  if (now < start) return { label: "Em breve", variant: "secondary" as const };
  if (now > end) return { label: "Encerrado", variant: "outline" as const };
  return { label: "Em andamento", variant: "success" as const };
}

export default function CatalogoPage() {
  const { data: seminars, isLoading } = useSeminars({ status: "published" });
  const [query, setQuery] = React.useState("");
  const [area, setArea] = React.useState<string>("all");
  const areas = React.useMemo(() => Array.from(new Set((seminars ?? []).map((s) => s.area).filter(Boolean))) as string[], [seminars]);
  const filtered = (seminars ?? []).filter((s) => {
    const matchesQuery = !query || s.title.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase());
    const matchesArea = area === "all" || s.area === area;
    return matchesQuery && matchesArea;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-16">
        <Container>
          <div className="mb-8">
            <span className="caption text-text-light">Catálogo</span>
            <h1 className="heading-lg text-text mt-1">Seminários publicados</h1>
            <p className="body-lg text-text-light max-w-2xl mt-2">
              Conheça os seminários em andamento e os que já encerraram. A inscrição é feita por convite do coordenador.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" />
              <Input placeholder="Buscar por título ou descrição..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setArea("all")}
                className={`px-4 h-11 rounded-lg body-md font-medium transition-colors ${area === "all" ? "bg-primary text-white" : "bg-surface text-text hover:bg-border"}`}
              >
                Todas
              </button>
              {areas.map((a) => (
                <button
                  key={a}
                  onClick={() => setArea(a)}
                  className={`px-4 h-11 rounded-lg body-md font-medium transition-colors ${area === a ? "bg-primary text-white" : "bg-surface text-text hover:bg-border"}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-text-light">Nenhum seminário encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => {
                const state = seminarState(s);
                return (
                  <Link key={s.id} href={`/seminarios/${s.slug}`} className="group">
                    <Card className="h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge variant={state.variant}>{state.label}</Badge>
                          {s.area && <Badge variant="outline">{s.area}</Badge>}
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">{s.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1.5 body-sm text-text-light">
                          <p>Início: <span className="text-text">{formatDate(s.startDate)}</span></p>
                          <p>Término: <span className="text-text">{formatDate(s.endDate)}</span></p>
                          <p>{s.totalLessons} aulas · {s.enrolledCount} participantes</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
