"use client";

import { BarChart3, BookOpen, GraduationCap, LayoutDashboard, Settings, Shield, ShieldAlert, UserCog, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isSuspended, useCurrentUser } from "@/hooks/use-auth";
import type { Role } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["coordinator", "super_admin"] },
  { href: "/admin/seminarios", label: "Seminários", icon: BookOpen, roles: ["coordinator", "super_admin"] },
  { href: "/admin/participantes", label: "Participantes", icon: Users, roles: ["coordinator", "super_admin"] },
  { href: "/admin/frequencia", label: "Frequência", icon: BarChart3, roles: ["coordinator", "super_admin"] },
  { href: "/admin/certificados", label: "Certificados", icon: GraduationCap, roles: ["super_admin"] },
  { href: "/admin/coordenadores", label: "Coordenadores", icon: UserCog, roles: ["super_admin"] },
  { href: "/admin/auditoria", label: "Auditoria", icon: Shield, roles: ["super_admin"] },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings, roles: ["super_admin"] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const suspended = isSuspended(user);
  const items = ITEMS.filter((i) => user && i.roles.includes(user.role));
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-white sticky top-16 h-[calc(100vh-4rem)]">
      <div className="px-4 py-4 border-b border-border">
        <p className="caption text-text-light">Painel</p>
        <p className="heading-sm text-text mt-0.5">{user?.role === "super_admin" ? "Super Admin" : "Coordenador"}</p>
      </div>
      {suspended && (
        <div className="m-4 p-3 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-900 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="body-sm">Sua conta está suspensa. Ações de escrita estão desabilitadas.</p>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 body-md font-medium transition-colors",
                active ? "bg-primary text-white" : "text-text hover:bg-surface hover:text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-border">
        <p className="caption text-text-light">Logado como</p>
        <p className="body-sm font-medium text-text mt-0.5 truncate">{user?.fullName}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          {suspended ? (
            <Badge variant="warning">Suspenso</Badge>
          ) : (
            <Badge variant="success">Ativo</Badge>
          )}
          <Badge variant="outline" className="text-text-light">
            {user?.role === "super_admin" ? "Super Admin" : "Coordenador"}
          </Badge>
        </div>
      </div>
    </aside>
  );
}
