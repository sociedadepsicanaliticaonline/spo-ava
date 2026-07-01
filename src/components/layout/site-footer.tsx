import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/ui/logo";

const SECTIONS = [
  {
    title: "Plataforma",
    links: [
      { href: "/catalogo", label: "Catálogo" },
      { href: "/como-funciona", label: "Como funciona" },
      { href: "/certificados/validar", label: "Validar certificado" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { href: "/sobre", label: "Sobre a SPO" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { href: "/faq", label: "Perguntas frequentes" },
      { href: "/termos", label: "Termos de uso" },
      { href: "/privacidade", label: "Privacidade" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-primary-dark text-white mt-24">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block" aria-label="SPO Learning — Início">
              <Logo variant="dark" size="md" />
            </Link>
            <p className="body-md text-white/70 max-w-sm">
              Plataforma de formação continuada da Sociedade Psicanalítica Online. Cursos, seminários e certificações para
              profissionais e estudantes de psicanálise.
            </p>
            <div className="space-y-2 pt-2">
              <a href="mailto:contato@spolearning.com" className="flex items-center gap-2 body-sm text-white/60 hover:text-primary-light">
                <Mail className="h-4 w-4" /> contato@spolearning.com
              </a>
              <a href="tel:+5500000000000" className="flex items-center gap-2 body-sm text-white/60 hover:text-primary-light">
                <Phone className="h-4 w-4" /> +55 (00) 0000-0000
              </a>
            </div>
          </div>
          {SECTIONS.map((section) => (
            <div key={section.title} className="lg:col-span-2 space-y-3">
              <h3 className="caption text-white/80">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="body-sm text-white/60 hover:text-primary-light transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="caption text-white/80">Newsletter</h3>
            <p className="body-sm text-white/60">Receba novidades sobre novos seminários e eventos.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 h-10 rounded-lg bg-white/10 border border-white/20 px-3 body-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              <button
                type="button"
                className="h-10 px-4 rounded-lg bg-primary-light text-white body-sm font-medium hover:brightness-110"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 body-sm text-white/50">
          <span>© {new Date().getFullYear()} Sociedade Psicanalítica Online. Todos os direitos reservados.</span>
          <span>CNPJ 00.000.000/0001-00</span>
        </div>
      </Container>
    </footer>
  );
}
