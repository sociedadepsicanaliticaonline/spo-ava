"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-light shadow-sm active:shadow-none",
        secondary: "bg-surface text-primary hover:bg-border border border-border",
        outline: "border-2 border-primary text-primary bg-white hover:bg-primary/5",
        ghost: "text-text hover:text-primary hover:bg-surface",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        accent: "bg-accent text-white hover:brightness-90 shadow-sm active:shadow-none",
        danger: "bg-accent text-white hover:brightness-90 shadow-sm",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-body-md",
        sm: "h-9 px-4 py-2 text-body-sm",
        lg: "h-13 px-8 py-3 text-body-lg",
        xl: "h-14 px-10 py-4 text-body-lg",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={disabled || loading} {...props}>
        {loading && <Loader2 className="animate-spin" />}
        {!loading && leftIcon}
        <Slottable>{children}</Slottable>
        {!loading && rightIcon}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
