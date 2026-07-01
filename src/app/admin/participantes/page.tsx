"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";
import { useEnrollmentsBySeminar, useSeminars } from "@/hooks/use-entities";

export default function ParticipantsPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: seminars, isLoading } = useSeminars(
    user?.role === "super_admin" ? undefined : { coordinatorId: user?.id }
  );

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!user) return null;
  if (!seminars || seminars.length === 0) {
    return <EmptyState title="Sem seminários" description="Crie um seminário para gerenciar participantes." />;
  }

  return (
    <>
      <PageHeader title="Participantes" description="Selecione um seminário para gerenciar os participantes." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seminars.map((s) => (
          <Card key={s.id} className="hover:border-primary transition-colors">
            <CardContent className="p-5 space-y-3">
              <p className="heading-sm text-text">{s.title}</p>
              <p className="body-sm text-text-light">{s.enrolledCount} participantes</p>
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push(`/admin/seminarios/${s.id}?tab=participants`)}>
                Gerenciar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
