"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) router.replace("/login?next=/admin");
    if (!isLoading && user && user.role === "participant") router.replace("/dashboard");
  }, [isLoading, user, router]);

  if (isLoading || !user || user.role === "participant") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SiteHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 min-w-0 py-6 md:py-8 px-4 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
