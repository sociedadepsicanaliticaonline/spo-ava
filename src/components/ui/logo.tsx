import Image from "next/image";
import { cn } from "@/lib/utils";
import logoLight from "@/assets/logo-01.png";
import logoDark from "@/assets/logo-02.png";

type LogoVariant = "light" | "dark";

interface LogoProps {
  variant?: LogoVariant;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

const SIZES = {
  sm: { width: 110, height: 36 },
  md: { width: 140, height: 44 },
  lg: { width: 180, height: 60 },
  xl: { width: 240, height: 80 },
} as const;

export function Logo({ variant = "light", size = "md", className, priority }: LogoProps) {
  const { width, height } = SIZES[size];
  const src = variant === "dark" ? logoDark : logoLight;
  return (
    <Image
      src={src}
      alt="Sociedade Psicanalítica Online — SPO Learning"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto", className)}
      style={{ width: `${width}px`, height: "auto" }}
    />
  );
}

export function LogoLight(props: Omit<LogoProps, "variant">) {
  return <Logo {...props} variant="light" />;
}

export function LogoDark(props: Omit<LogoProps, "variant">) {
  return <Logo {...props} variant="dark" />;
}
