"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServices } from "@/services/provider";
import type { Article, AuditAction, Lesson, Module, Role, Seminar, User } from "@/types";

export function useSeminars(opts?: { status?: Seminar["status"]; coordinatorId?: string }) {
  const services = useServices();
  return useQuery({ queryKey: ["seminars", opts], queryFn: () => services.seminars.list(opts) });
}

export function useSeminar(id?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["seminar", id], queryFn: () => services.seminars.byId(id!), enabled: !!id });
}

export function useSeminarBySlug(slug?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["seminar", "slug", slug], queryFn: () => services.seminars.bySlug(slug!), enabled: !!slug });
}

export function useSeminarStructure(id?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["seminar", id, "structure"], queryFn: () => services.seminars.structure(id!), enabled: !!id });
}

export function useCreateSeminar() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, actor }: { input: Omit<Seminar, "id" | "slug" | "createdAt" | "updatedAt">; actor: User }) =>
      services.seminars.create(input, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["seminars"] }),
  });
}

export function useUpdateSeminar() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch, actor }: { id: string; patch: Partial<Seminar>; actor: User }) =>
      services.seminars.update(id, patch, actor),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["seminars"] });
      qc.invalidateQueries({ queryKey: ["seminar", vars.id] });
    },
  });
}

export function usePublishSeminar() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actor }: { id: string; actor: User }) => services.seminars.publish(id, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["seminars"] }),
  });
}

export function useRemoveSeminar() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actor }: { id: string; actor: User }) => services.seminars.remove(id, actor),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seminars"] });
      qc.invalidateQueries({ queryKey: ["seminar"] });
    },
  });
}

export function useModules(seminarId?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["modules", seminarId], queryFn: () => services.modules.listBySeminar(seminarId!), enabled: !!seminarId });
}

export function useCreateModule() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, actor }: { input: Omit<Module, "id" | "createdAt">; actor: User }) =>
      services.modules.create(input, actor),
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["modules", vars.input.seminarId] }),
  });
}

export function useUpdateModule() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch, actor }: { id: string; patch: Partial<Module>; actor: User }) =>
      services.modules.update(id, patch, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules"] }),
  });
}

export function useRemoveModule() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actor }: { id: string; actor: User }) => services.modules.remove(id, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules"] }),
  });
}

export function useLessonsByModule(moduleId?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["lessons", "module", moduleId], queryFn: () => services.lessons.listByModule(moduleId!), enabled: !!moduleId });
}

export function useLessonsBySeminar(seminarId?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["lessons", "seminar", seminarId], queryFn: () => services.lessons.listBySeminar(seminarId!), enabled: !!seminarId });
}

export function useLesson(lessonId?: string, userId?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["lesson", lessonId, userId], queryFn: () => services.lessons.withProgress(lessonId!, userId!), enabled: !!lessonId && !!userId });
}

export function useCreateLesson() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, actor }: { input: Omit<Lesson, "id" | "createdAt">; actor: User }) => services.lessons.create(input, actor),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["lessons"] });
      qc.invalidateQueries({ queryKey: ["seminar", vars.input.seminarId, "structure"] });
    },
  });
}

export function useUpdateLesson() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch, actor }: { id: string; patch: Partial<Lesson>; actor: User }) =>
      services.lessons.update(id, patch, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useRemoveLesson() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actor }: { id: string; actor: User }) => services.lessons.remove(id, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useEnrollmentsByUser(userId?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["enrollments", "user", userId], queryFn: () => services.enrollments.listByUser(userId!), enabled: !!userId });
}

export function useEnrollmentsBySeminar(seminarId?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["enrollments", "seminar", seminarId], queryFn: () => services.enrollments.listBySeminar(seminarId!), enabled: !!seminarId });
}

export function useEnroll() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, seminarId, actor }: { userId: string; seminarId: string; actor: User }) =>
      services.enrollments.enroll(userId, seminarId, actor),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["enrollments"] });
      qc.invalidateQueries({ queryKey: ["seminars"] });
      qc.invalidateQueries({ queryKey: ["seminar", vars.seminarId] });
    },
  });
}

export function useRemoveEnrollment() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, actor }: { enrollmentId: string; actor: User }) => services.enrollments.remove(enrollmentId, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enrollments"] }),
  });
}

export function useProgressByUser(userId?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["progress", "user", userId], queryFn: () => services.progress.listByUser(userId!), enabled: !!userId });
}

export function useSeminarProgress(seminarId?: string, userId?: string) {
  const services = useServices();
  return useQuery({
    queryKey: ["progress", "seminar", seminarId, "user", userId],
    queryFn: () => services.progress.seminarProgressForUser(seminarId!, userId!),
    enabled: !!seminarId && !!userId,
  });
}

export function useSeminarOverview(seminarId?: string) {
  const services = useServices();
  return useQuery({
    queryKey: ["progress", "seminar", seminarId, "overview"],
    queryFn: () => services.progress.seminarOverviewForCoordinator(seminarId!),
    enabled: !!seminarId,
  });
}

export function useUpsertProgress() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      input,
      actor,
    }: {
      input: { userId: string; lessonId: string; seminarId: string; maxWatchedPercent: number; completed?: boolean };
      actor: User;
    }) => services.progress.upsert(input, actor),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["progress"] });
      qc.invalidateQueries({ queryKey: ["lesson", vars.input.lessonId] });
    },
  });
}

export function useCertificatesByUser(userId?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["certificates", "user", userId], queryFn: () => services.certificates.listByUser(userId!), enabled: !!userId });
}

export function useCertificateByCode(code?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["certificates", "code", code], queryFn: () => services.certificates.byValidationCode(code!), enabled: !!code });
}

export function useIssueCertificate() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, actor, manual }: { input: { userId: string; seminarId: string }; actor: User; manual?: boolean }) =>
      services.certificates.issue(input, actor, { manual }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["certificates"] }),
  });
}

export function useRevokeCertificate() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason, actor }: { id: string; reason: string; actor: User }) =>
      services.certificates.revoke(id, reason, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["certificates"] }),
  });
}

export function useArticlesBySeminar(seminarId?: string) {
  const services = useServices();
  return useQuery({ queryKey: ["articles", "seminar", seminarId], queryFn: () => services.articles.listBySeminar(seminarId!), enabled: !!seminarId });
}

export function useCreateArticle() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, actor }: { input: Omit<Article, "id" | "createdAt">; actor: User }) =>
      services.articles.create(input, actor),
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["articles", "seminar", vars.input.seminarId] }),
  });
}

export function useRemoveArticle() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, actor }: { id: string; actor: User }) => services.articles.remove(id, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });
}

export function useSettings() {
  const services = useServices();
  return useQuery({ queryKey: ["settings"], queryFn: () => services.settings.list() });
}

export function useSetSetting() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value, actor }: { key: string; value: unknown; actor: User }) => services.settings.set(key, value, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useAuditLogs() {
  const services = useServices();
  return useQuery({ queryKey: ["audit"], queryFn: () => services.audit.list() });
}

export function useLogAudit() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ action, actor, meta }: { action: AuditAction; actor: User; meta?: { targetTable?: string; targetId?: string; metadata?: Record<string, unknown> } }) =>
      services.audit.log(action, actor, meta),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["audit"] }),
  });
}

export function useSetCoordinatorStatus() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, actor }: { id: string; status: "active" | "suspended"; actor: User }) =>
      services.users.setCoordinatorStatus(id, status, actor),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useCreateUser() {
  const services = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input }: { input: { email: string; fullName: string; role: Role; coordinatorStatus?: "active" | "suspended" | null } }) =>
      services.users.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
