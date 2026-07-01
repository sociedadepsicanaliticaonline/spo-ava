"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, backHref, backLabel, action, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6 md:mb-8", className)}>
      <div className="space-y-1.5">
        {backHref && (
          <Button asChild variant="link" size="sm" className="-ml-2 text-text-light">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" /> {backLabel ?? "Voltar"}
            </Link>
          </Button>
        )}
        <h1 className="heading-lg text-text">{title}</h1>
        {description && <p className="body-lg text-text-light max-w-2xl">{description}</p>}
        {children}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}
