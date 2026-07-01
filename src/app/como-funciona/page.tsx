"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Award, BookOpen, BarChart3, ShieldCheck } from "lucide-react";

const STEPS = [
  { icon: BookOpen, title: "1. Coordenador cria o seminário", desc: "Define título, datas, módulos, aulas (YouTube) e materiais." },
  { icon: CheckCircle2, title: "2. Coordenador matricula participantes", desc: "Inscrição é sempre manual, feita pelo coordenador do seminário." },
  { icon: BarChart3, title: "3. Participante assiste e progride", desc: "Progresso medido pela IFrame API do YouTube, com tolerância configurável." },
  { icon: Award, title: "4. Certificado liberado", desc: "Após a data de término e 100% das aulas concluídas, o certificado é emitido automaticamente." },
  { icon: ShieldCheck, title: "5. Validação pública", desc: "Qualquer pessoa pode validar o certificado pelo QR Code, sem login." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-16">
        <Container className="max-w-3xl">
          <h1 className="heading-lg text-text mb-3">Como funciona a plataforma</h1>
          <p className="body-lg text-text-light mb-10">
            A SPO Learning organiza a formação continuada em seminários com módulos, aulas em vídeo e certificação
            automática baseada em data de término e conclusão integral.
          </p>
          <div className="space-y-4">
            {STEPS.map((s) => (
              <Card key={s.title} className="p-0 overflow-hidden">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="heading-sm text-text">{s.title}</h2>
                    <p className="body-md text-text-light mt-1">{s.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg"><Link href="/catalogo">Ver catálogo</Link></Button>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
