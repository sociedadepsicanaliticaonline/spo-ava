import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center">
        <Container className="text-center max-w-md">
          <p className="caption text-text-light">Erro 404</p>
          <h1 className="heading-xl text-text mt-2">Página não encontrada</h1>
          <p className="body-lg text-text-light mt-3">
            A rota que você procura não existe ou foi movida.
          </p>
          <div className="mt-8">
            <Button asChild><Link href="/">Voltar ao início</Link></Button>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
