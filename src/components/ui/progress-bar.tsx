import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "accent" | "success";
}

export function ProgressBar({ value, max = 100, showLabel, className, size = "md", variant = "primary", ...props }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const sizes = { sm: "h-1.5", md: "h-2", lg: "h-3" } as const;
  const variants = {
    primary: "bg-primary",
    accent: "bg-accent",
    success: "bg-green-600",
  } as const;
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className={cn("w-full overflow-hidden rounded-full bg-border", sizes[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", variants[variant])}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && <p className="body-sm text-text-light mt-1.5">{Math.round(percent)}% concluído</p>}
    </div>
  );
}
