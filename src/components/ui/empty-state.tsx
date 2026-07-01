import { Inbox } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="mb-4 text-text-light">{icon ?? <Inbox className="h-12 w-12" />}</div>
      <h3 className="heading-md text-text mb-2">{title}</h3>
      {description && <p className="body-md text-text-light max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
