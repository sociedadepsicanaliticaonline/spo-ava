"use client";

import { useState } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/components/forms/form-fields";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCertificateByCode } from "@/hooks/use-entities";

export default function ValidateIndexPage() {
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState("");
  const { data: cert, isLoading } = useCertificateByCode(submitted);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-16">
        <Container className="max-w-xl">
          <h1 className="heading-lg text-text mb-3">Validar certificado</h1>
          <p className="body-lg text-text-light mb-8">
            Informe o código de validação presente no certificado para confirmar sua autenticidade.
          </p>
          <Card>
            <CardContent className="p-6 space-y-4">
              <FormInput
                label="Código de validação"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SPO-XXXX-XXXX-XXXX"
                className="font-mono"
              />
              <Button className="w-full" onClick={() => setSubmitted(code)} loading={isLoading}>
                Validar
              </Button>
            </CardContent>
          </Card>
          {submitted && cert && (
            <Card className="mt-6 p-5">
              <p className="heading-sm text-text">{cert.user.fullName}</p>
              <p className="body-md text-text-light">{cert.seminar.title}</p>
              <p className="caption text-text-light mt-2">Emitido em {new Date(cert.issuedAt).toLocaleDateString("pt-BR")}</p>
            </Card>
          )}
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
