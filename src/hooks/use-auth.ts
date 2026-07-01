"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServices } from "@/services/provider";
import type { User } from "@/types";

const AUTH_KEY = ["auth", "current-user"] as const;

export function useCurrentUser() {
  const services = useServices();
  return useQuery({
    queryKey: AUTH_KEY,
    queryFn: () => services.auth.currentUser(),
    staleTime: Infinity,
  });
}

export function useLoginAs() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => services.auth.loginAs(userId),
    onSuccess: (user) => {
      qc.setQueryData(AUTH_KEY, user);
      qc.invalidateQueries();
    },
  });
}

export function useLogout() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => services.auth.logout(),
    onSuccess: () => {
      qc.setQueryData(AUTH_KEY, null);
      qc.invalidateQueries();
    },
  });
}

export function useUsers() {
  const services = useServices();
  return useQuery<User[]>({ queryKey: ["users"], queryFn: () => services.users.list() });
}

export function canAccess(actor: User | null | undefined, requiredRoles: User["role"][]) {
  if (!actor) return false;
  return requiredRoles.includes(actor.role);
}

export function isSuspended(actor: User | null | undefined) {
  return actor?.role === "coordinator" && actor.coordinatorStatus === "suspended";
}
