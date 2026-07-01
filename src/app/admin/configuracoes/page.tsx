"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput, FormSwitch } from "@/components/forms/form-fields";
import { useCurrentUser } from "@/hooks/use-auth";
import { useSettings, useSetSetting } from "@/hooks/use-entities";

export default function SettingsPage() {
  const { data: user } = useCurrentUser();
  const { data: settings } = useSettings();
  const setSetting = useSetSetting();
  const [threshold, setThreshold] = useState<number | null>(null);
  const [autoIssue, setAutoIssue] = useState<boolean | null>(null);

  if (!user || user.role !== "super_admin") return null;
  const t = settings?.find((s) => s.key === "completion_threshold_percent");
  const a = settings?.find((s) => s.key === "auto_issue_certificates");
  const currentThreshold = threshold ?? (typeof t?.value === "number" ? t.value : 95);
  const currentAuto = autoIssue ?? (typeof a?.value === "boolean" ? a.value : true);

  return (
    <>
      <PageHeader title="Configurações" description="Parâmetros globais da plataforma." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Certificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Threshold de conclusão (%)"
              type="number"
              min={50}
              max={100}
              value={currentThreshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              description="Percentual mínimo do tempo assistido por aula para ser considerada concluída."
            />
            <Button
              size="sm"
              onClick={async () => {
                try {
                  await setSetting.mutateAsync({ key: "completion_threshold_percent", value: currentThreshold, actor: user });
                  toast.success("Configuração salva");
                  setThreshold(null);
                } catch (e: any) {
                  toast.error(e.message);
                }
              }}
              loading={setSetting.isPending}
              disabled={threshold === null}
            >
              Salvar threshold
            </Button>
            <FormSwitch
              label="Emissão automática de certificados"
              description="Quando ativo, certificados são gerados automaticamente após end_date + 100% concluído."
              checked={currentAuto}
              onCheckedChange={setAutoIssue}
            />
            <Button
              size="sm"
              onClick={async () => {
                try {
                  await setSetting.mutateAsync({ key: "auto_issue_certificates", value: currentAuto, actor: user });
                  toast.success("Configuração salva");
                  setAutoIssue(null);
                } catch (e: any) {
                  toast.error(e.message);
                }
              }}
              loading={setSetting.isPending}
              disabled={autoIssue === null}
            >
              Salvar
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configurações atuais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="divide-y divide-border">
              {(settings ?? []).map((s) => (
                <li key={s.key} className="py-2 flex items-center justify-between gap-2">
                  <div>
                    <p className="body-sm font-medium text-text">{s.key}</p>
                    <p className="caption text-text-light">atualizado em {new Date(s.updatedAt).toLocaleString("pt-BR")}</p>
                  </div>
                  <Badge variant="outline">{String(typeof s.value === "object" ? JSON.stringify(s.value) : s.value)}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
