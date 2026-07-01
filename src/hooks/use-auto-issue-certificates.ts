"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServices } from "@/services/provider";
import { useCurrentUser } from "./use-auth";
import type { User } from "@/types";

/**
 * Job fake de emissão automática de certificados.
 * Espelha o que o `pg_cron` faria no Supabase:
 * - Para cada seminário com end_date <= agora
 * - Para cada enrollment ativo
 * - Se o participante tem 100% das aulas concluídas (>= threshold)
 * - E ainda não tem certificado ativo
 * - Emite o certificado e gera log de auditoria
 */
export function useAutoIssueCertificates(actor: User | null) {
  const services = useServices();
  const qc = useQueryClient();
  const ran = useRef(false);

  useEffect(() => {
    if (!actor || actor.role !== "participant" || ran.current) return;
    ran.current = true;
    let cancelled = false;

    (async () => {
      try {
        const threshold = (await services.settings.get<number>("completion_threshold_percent")) ?? 95;
        const autoEnabled = (await services.settings.get<boolean>("auto_issue_certificates")) ?? true;
        if (!autoEnabled) return;

        const enrollments = await services.enrollments.listByUser(actor.id);
        if (cancelled) return;

        for (const enrollment of enrollments) {
          if (cancelled) break;
          if (enrollment.status !== "active") continue;
          const seminar = enrollment.seminar;
          if (new Date(seminar.endDate).getTime() > Date.now()) continue;
          if (enrollment.attendance.completedLessons < enrollment.attendance.totalLessons) continue;
          if (enrollment.attendance.totalLessons === 0) continue;
          if (enrollment.attendance.percentComplete < threshold) continue;

          const existing = await services.certificates.byId("");
          // checagem real abaixo
          const userCerts = await services.certificates.listByUser(actor.id);
          const already = userCerts.find((c) => c.seminarId === seminar.id && !c.revoked);
          if (already) continue;

          const cert = await services.certificates.issue({ userId: actor.id, seminarId: seminar.id }, actor, { manual: false });
          await services.audit.log("certificate.issued_auto", actor, {
            targetTable: "certificates",
            targetId: cert.id,
            metadata: { seminarId: seminar.id, userId: actor.id },
          });
        }
        qc.invalidateQueries({ queryKey: ["certificates"] });
        qc.invalidateQueries({ queryKey: ["audit"] });
      } catch (err) {
        console.error("[auto-issue] erro:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [actor?.id]);
}
