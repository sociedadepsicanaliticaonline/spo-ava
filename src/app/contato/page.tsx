import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/components/forms/form-fields";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-16">
        <Container className="max-w-xl">
          <h1 className="heading-lg text-text mb-3">Contato</h1>
          <p className="body-lg text-text-light mb-8">
            Em caso de dúvidas sobre seminários, matrículas ou certificados, entre em contato com a coordenação.
          </p>
          <Card>
            <CardContent className="p-6 space-y-4">
              <FormInput label="Nome" placeholder="Seu nome" />
              <FormInput label="E-mail" type="email" placeholder="seu@email.com" />
              <div className="space-y-2">
                <label className="body-sm font-medium text-text">Mensagem</label>
                <textarea rows={5} className="flex min-h-[80px] w-full rounded-lg border border-border bg-white px-4 py-2.5 body-md text-text placeholder:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Escreva sua mensagem..." />
              </div>
              <Button className="w-full"><Mail className="h-4 w-4" /> Enviar mensagem</Button>
              <p className="caption text-text-light text-center">
                Ou envie diretamente para <a href="mailto:contato@spolearning.com" className="text-primary hover:underline">contato@spolearning.com</a>.
              </p>
            </CardContent>
          </Card>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
