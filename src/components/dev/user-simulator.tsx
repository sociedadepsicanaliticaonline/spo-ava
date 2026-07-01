"use client";

import { ChevronDown, Repeat } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, getInitials } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLoginAs, useLogout, useUsers } from "@/hooks/use-auth";
import { db } from "@/data/store";
import type { User } from "@/types";

const ROLE_LABEL: Record<User["role"], string> = {
  participant: "Participante",
  coordinator: "Coordenador",
  super_admin: "Super Admin",
};

export function UserSimulator() {
  const { data: current } = useCurrentUser();
  const { data: users } = useUsers();
  const loginAs = useLoginAs();
  const logout = useLogout();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleReset = () => {
    db.reset();
    logout.mutate();
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="sm" className="rounded-full shadow-lg gap-2 pl-2 pr-3">
            <Repeat className="h-4 w-4" />
            {current ? (
              <>
                <Avatar className="h-6 w-6 bg-white/20">
                  <AvatarFallback className="bg-white/20 text-white text-[10px]">{getInitials(current.fullName)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline max-w-[140px] truncate">{current.fullName.split(" ")[0]}</span>
              </>
            ) : (
              <span>Simular usuário</span>
            )}
            <ChevronDown className="h-3 w-3 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 max-h-96 overflow-y-auto">
          <DropdownMenuLabel>
            <div className="flex items-center justify-between gap-2">
              <span>Simular usuário (dev)</span>
              <Badge variant="outline" className="text-text-light">mock</Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!current && (
            <DropdownMenuItem disabled className="text-text-light">
              Nenhum usuário logado
            </DropdownMenuItem>
          )}
          {current && (
            <DropdownMenuItem
              onSelect={async () => {
                await logout.mutateAsync();
                if (typeof window !== "undefined") window.location.reload();
              }}
            >
              <span className="text-accent">                Sair (voltar para &ldquo;deslogado&rdquo;)</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-text-light">Alternar para</DropdownMenuLabel>
          {(users ?? []).map((u) => (
            <DropdownMenuItem
              key={u.id}
              onSelect={async () => {
                await loginAs.mutateAsync(u.id);
                if (typeof window !== "undefined") window.location.reload();
              }}
              className="flex items-start gap-2"
            >
              <Avatar className="h-7 w-7 mt-0.5">
                <AvatarFallback className="text-[10px]">{getInitials(u.fullName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{u.fullName}</p>
                <p className="caption text-text-light flex items-center gap-1">
                  {ROLE_LABEL[u.role]}
                  {u.coordinatorStatus === "suspended" && <Badge variant="warning" className="ml-1">suspenso</Badge>}
                </p>
              </div>
              {current?.id === u.id && <Badge variant="secondary">atual</Badge>}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleReset} className="text-accent">
            Resetar banco de dados mock
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
