"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) router.replace("/login?next=/dashboard");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader />
      <main className="flex-1 py-8 md:py-12">{children}</main>
    </div>
  );
}
