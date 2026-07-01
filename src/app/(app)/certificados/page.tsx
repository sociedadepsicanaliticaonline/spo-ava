"use client";

import { Award, Download, ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useAutoIssueCertificates } from "@/hooks/use-auto-issue-certificates";
import { useCurrentUser } from "@/hooks/use-auth";
import { useCertificatesByUser } from "@/hooks/use-entities";
import { formatDate } from "@/lib/utils";

export default function CertificatesPage() {
  const { data: user } = useCurrentUser();
  const { data: certs, isLoading, refetch } = useCertificatesByUser(user?.id);
  const [autoIssuedThisVisit, setAutoIssuedThisVisit] = useState(0);

  useAutoIssueCertificates(user ?? null);
  const [previousCount, setPreviousCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!certs) return;
    if (previousCount === undefined) {
      setPreviousCount(certs.length);
      return;
    }
    const newOnes = certs.length - previousCount;
    if (newOnes > 0) {
      setAutoIssuedThisVisit(newOnes);
      toast.success(`${newOnes} certificado${newOnes > 1 ? "s" : ""} emitido${newOnes > 1 ? "s" : ""} automaticamente!`);
    }
    setPreviousCount(certs.length);
  }, [certs?.length]);

  return (
    <Container>
      <PageHeader
        title="Meus certificados"
        description="Certificados são liberados automaticamente após a conclusão integral de cada seminário e o término do prazo."
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" /> Atualizar
          </Button>
        }
      />
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !certs || certs.length === 0 ? (
        <EmptyState
          icon={<Award className="h-12 w-12" />}
          title="Nenhum certificado ainda"
          description="Conclua 100% das aulas e aguarde o término do seminário para receber seu certificado automaticamente."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((c) => (
            <Card key={c.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  {c.revoked ? <Badge variant="error">Revogado</Badge> : <Badge variant="success">Válido</Badge>}
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-lg">{c.seminar.title}</CardTitle>
                <CardDescription>Emitido em {formatDate(c.issuedAt)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-body-sm">
                  <span className="caption text-text-light">Código de validação</span>
                  <p className="font-mono text-text mt-1">{c.validationCode}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/api/certificates/${c.id}/pdf`} target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" /> Baixar PDF
                    </a>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`/certificados/validar/${c.validationCode}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" /> Validar
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
