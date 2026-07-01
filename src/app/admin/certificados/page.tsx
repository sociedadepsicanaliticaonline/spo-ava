"use client";

import { Award, Download, ExternalLink } from "lucide-react";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";
import { useAuditLogs, useEnrollmentsBySeminar, useIssueCertificate, useSeminars } from "@/hooks/use-entities";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function CertificatesAdminPage() {
  const { data: user } = useCurrentUser();
  const { data: seminars } = useSeminars();
  const { data: audit } = useAuditLogs();
  const issue = useIssueCertificate();

  if (!user || user.role !== "super_admin") return null;
  const allCerts = (audit ?? []).filter((a) => a.action === "certificate.issued_auto" || a.action === "certificate.issued_manual");

  const onManualIssue = async (userId: string, seminarId: string, name: string, title: string) => {
    if (!confirm(`Emitir manualmente o certificado de ${name} para "${title}"?`)) return;
    try {
      await issue.mutateAsync({ input: { userId, seminarId }, actor: user, manual: true });
      toast.success("Certificado emitido");
    } catch (e: any) {
      toast.error(e.message ?? "Erro");
    }
  };

  return (
    <>
      <PageHeader
        title="Certificados"
        description="Emissão manual, revogação e histórico de certificados da plataforma."
      />

      <h2 className="heading-sm text-text mb-3">Emissão manual</h2>
      <div className="space-y-3 mb-8">
        {(seminars ?? []).filter((s) => s.status !== "draft").map((s) => (
          <SeminarManualIssue key={s.id} seminarId={s.id} title={s.title} actorId={user.id} />
        ))}
      </div>

      <h2 className="heading-sm text-text mb-3">Histórico recente</h2>
      {allCerts.length === 0 ? (
        <EmptyState icon={<Award className="h-12 w-12" />} title="Nenhum certificado emitido" />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {allCerts.map((log) => (
                <li key={log.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="body-sm text-text">
                      <Badge variant={log.action === "certificate.issued_manual" ? "accent" : "success"}>
                        {log.action === "certificate.issued_manual" ? "Manual" : "Automático"}
                      </Badge>{" "}
                      <span className="ml-2">{log.actor?.fullName ?? "Sistema"}</span>
                    </p>
                    <p className="caption text-text-light">{log.targetId} · {formatDate(log.createdAt, { withTime: true })}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}

function SeminarManualIssue({ seminarId, title, actorId }: { seminarId: string; title: string; actorId: string }) {
  const { data: enrollments, isLoading } = useEnrollmentsBySeminar(seminarId);
  const { data: user } = useCurrentUser();
  const issue = useIssueCertificate();
  if (isLoading) return <Card><CardContent className="p-4"><Spinner size="sm" /></CardContent></Card>;
  if (!user) return null;
  return (
    <Card>
      <CardContent className="p-4">
        <p className="heading-sm text-text">{title}</p>
        <p className="caption text-text-light mb-3">{enrollments?.length ?? 0} participantes</p>
        <ul className="space-y-1.5">
          {(enrollments ?? []).map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-2 body-sm">
              <span className="text-text">{e.user.fullName} <span className="text-text-light">· {e.attendance.percentComplete}%</span></span>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    await issue.mutateAsync({ input: { userId: e.userId, seminarId }, actor: user, manual: true });
                    toast.success("Certificado emitido");
                  } catch (err: any) {
                    toast.error(err.message ?? "Erro");
                  }
                }}
                loading={issue.isPending}
              >
                Emitir certificado
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
