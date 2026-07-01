"use client";

import { useParams } from "next/navigation";
import * as React from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { Spinner } from "@/components/ui/spinner";
import { useCertificateByCode } from "@/hooks/use-entities";
import { formatDate } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

export default function ValidateCertificatePage() {
  const params = useParams<{ code: string }>();
  const { data: cert, isLoading } = useCertificateByCode(params.code);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <Container className="max-w-2xl">
          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : !cert ? (
            <Card variant="surface" className="p-8 text-center">
              <ShieldAlert className="h-10 w-10 text-accent mx-auto mb-3" />
              <h1 className="heading-md text-text">Certificado não encontrado</h1>
              <p className="body-md text-text-light mt-2">Verifique se o código digitado está correto.</p>
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className={`p-6 text-white ${cert.revoked ? "bg-accent" : "bg-primary-dark"}`}>
                <div className="mb-4">
                  <Logo variant="dark" size="md" />
                </div>
                <Badge variant={cert.revoked ? "error" : "success"} className="mb-3">
                  {cert.revoked ? "REVOGADO" : "AUTÊNTICO"}
                </Badge>
                <h1 className="heading-lg text-white">Certificado de Conclusão</h1>
                <p className="body-md text-white/70 mt-1">Sociedade Psicanalítica Online — SPO Learning</p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="caption text-text-light">Participante</p>
                  <p className="heading-md text-text mt-1">{cert.user.fullName}</p>
                </div>
                <div>
                  <p className="caption text-text-light">Seminário</p>
                  <p className="heading-sm text-text mt-1">{cert.seminar.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="caption text-text-light">Data de emissão</p>
                    <p className="body-md text-text mt-1">{formatDate(cert.issuedAt)}</p>
                  </div>
                  <div>
                    <p className="caption text-text-light">Validade</p>
                    <p className="body-md text-text mt-1">Permanente</p>
                  </div>
                </div>
                <div>
                  <p className="caption text-text-light">Código de validação</p>
                  <p className="font-mono body-md text-text mt-1">{cert.validationCode}</p>
                </div>
                {cert.revoked && (
                  <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                    <p className="body-sm text-accent font-medium">Este certificado foi revogado.</p>
                    {cert.revokedReason && <p className="caption text-text-light mt-1">{cert.revokedReason}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
