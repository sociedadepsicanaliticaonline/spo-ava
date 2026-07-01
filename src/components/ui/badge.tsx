import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 caption font-body", {
  variants: {
    variant: {
      default: "border-transparent bg-primary text-white",
      secondary: "border-transparent bg-surface text-primary",
      accent: "border-transparent bg-accent text-white",
      outline: "border-border text-text-light bg-white",
      success: "border-transparent bg-green-100 text-green-800",
      warning: "border-transparent bg-yellow-100 text-yellow-800",
      error: "border-transparent bg-red-100 text-red-800",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
