import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary-dark via-primary-dark to-primary text-white py-24 md:py-32">
          <Container>
            <div className="max-w-3xl">
              <div className="mb-8">
                <Logo variant="dark" size="lg" priority />
              </div>
              <span className="caption text-primary-light">Plataforma de formação</span>
              <h1 className="heading-xl mt-3 mb-6 text-white">
                Educação continuada em psicanálise, com profundidade e rigor.
              </h1>
              <p className="body-lg text-white/70 max-w-2xl">
                Seminários, módulos e aulas em vídeo com certificação automática. Acompanhe sua formação, sua frequência e
                seus certificados em um único lugar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="accent" size="lg">
                  <Link href="/catalogo">
                    Ver catálogo <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Link href="/como-funciona">Como funciona</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container>
            <h2 className="heading-lg text-text text-center mb-12">O que você encontra na plataforma</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: BookOpen, title: "Seminários estruturados", desc: "Conteúdo organizado em módulos e aulas em vídeo do YouTube, com materiais de apoio." },
                { icon: ShieldCheck, title: "Certificação automática", desc: "Certificados liberados após a conclusão de 100% das aulas e o término do seminário." },
                { icon: GraduationCap, title: "Acompanhamento real", desc: "Progresso medido pela IFrame API do YouTube, com relatórios de frequência ao coordenador." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="heading-sm text-text mb-2">{item.title}</h3>
                  <p className="body-md text-text-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24 bg-surface">
          <Container>
            <div className="rounded-2xl bg-primary-dark text-white p-10 md:p-16 text-center">
              <h2 className="heading-lg text-white mb-4">Pronto para começar sua formação?</h2>
              <p className="body-lg text-white/70 max-w-2xl mx-auto mb-8">
                A inscrição é feita por convite do coordenador do seminário. Se você é associado da SPO, entre em contato
                com a coordenação.
              </p>
              <Button asChild variant="accent" size="lg">
                <Link href="/catalogo">Explorar seminários</Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
