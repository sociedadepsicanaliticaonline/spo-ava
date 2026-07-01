"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Container } from "@/components/layout/container";
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/como-funciona", label: "Como funciona" },
];

function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="SPO Learning — Início">
      <Logo variant="light" size="md" priority />
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const logout = useLogout();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border">
      <Container className="flex items-center justify-between h-16 md:h-20 gap-4">
        <div className="flex items-center gap-8">
          <HeaderLogo />
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md body-md font-medium transition-colors",
                  isActive(item.href) ? "text-primary bg-primary/5" : "text-text hover:text-primary hover:bg-surface"
                )}
              >
                {item.label}
              </Link>
            ))}
            {(user?.role === "coordinator" || user?.role === "super_admin") && (
              <Link
                href="/admin"
                className={cn(
                  "px-3 py-2 rounded-md body-md font-medium transition-colors",
                  pathname.startsWith("/admin") ? "text-primary bg-primary/5" : "text-text hover:text-primary hover:bg-surface"
                )}
              >
                Painel
              </Link>
            )}
            {user?.role === "participant" && (
              <Link
                href="/dashboard"
                className={cn(
                  "px-3 py-2 rounded-md body-md font-medium transition-colors",
                  pathname.startsWith("/dashboard") ? "text-primary bg-primary/5" : "text-text hover:text-primary hover:bg-surface"
                )}
              >
                Minha área
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-9 w-24 rounded-lg bg-surface animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 px-2 gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline body-sm font-medium max-w-[120px] truncate">{user.fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="normal-case font-normal">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text body-md font-medium">{user.fullName}</span>
                    <span className="caption text-text-light">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "participant" && (
                  <DropdownMenuItem onSelect={() => router.push("/dashboard")}>Minha área</DropdownMenuItem>
                )}
                {(user.role === "coordinator" || user.role === "super_admin") && (
                  <DropdownMenuItem onSelect={() => router.push("/admin")}>Painel administrativo</DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => router.push("/perfil")}>Perfil</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={async () => {
                    await logout.mutateAsync();
                    router.push("/");
                  }}
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/login">
                <LogIn className="h-4 w-4" /> Entrar
              </Link>
            </Button>
          )}
        </div>
      </Container>
    </header>
  );
}
