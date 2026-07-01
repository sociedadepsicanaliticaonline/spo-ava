import { db, genId, genValidationCode, session } from "@/data/store";
import { slugify } from "@/lib/utils";
import type {
  Article,
  AuditAction,
  AuditLog,
  Certificate,
  CertificateWithSeminar,
  Enrollment,
  EnrollmentWithSeminar,
  EnrollmentWithUser,
  Lesson,
  LessonProgress,
  LessonWithProgress,
  Module,
  ModuleWithLessons,
  Role,
  Seminar,
  SeminarWithMeta,
  Settings,
  User,
} from "@/types";
import {
  NotFoundError,
  PermissionError,
  ValidationError,
  type ArticlesService,
  type AuditService,
  type AuthService,
  type CertificatesService,
  type EnrollmentsService,
  type LessonsService,
  type ModulesService,
  type ProgressService,
  type SeminarsService,
  type Services,
  type SettingsService,
  type UsersService,
} from "./types";

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

function nowIso() {
  return new Date().toISOString();
}

function getUser(id: string | null | undefined): User | null {
  if (!id) return null;
  return (db.list("users") as User[]).find((u) => u.id === id) ?? null;
}

function requireUser(actor: User | null | undefined): asserts actor is User {
  if (!actor) throw new PermissionError("Usuário não autenticado.");
}

function requireSuperAdmin(actor: User) {
  if (actor.role !== "super_admin") throw new PermissionError("Apenas Super Admin pode realizar essa ação.");
}

function requireCoordinatorOrAdmin(actor: User) {
  if (actor.role === "super_admin") return;
  if (actor.role === "coordinator") {
    if (actor.coordinatorStatus === "suspended") {
      throw new PermissionError("Sua conta de coordenador está suspensa. Ações de escrita estão desabilitadas.");
    }
    return;
  }
  throw new PermissionError("Apenas coordenadores e administradores podem realizar essa ação.");
}

function canManageSeminar(actor: User, seminar: Seminar): boolean {
  if (actor.role === "super_admin") return true;
  if (actor.role === "coordinator" && actor.coordinatorStatus === "active" && seminar.coordinatorId === actor.id) return true;
  return false;
}

function buildSeminarMeta(seminar: Seminar): SeminarWithMeta {
  const lessons = (db.list("lessons") as Lesson[]).filter((l) => l.seminarId === seminar.id);
  const enrollments = (db.list("enrollments") as Enrollment[]).filter((e) => e.seminarId === seminar.id && e.status === "active");
  return {
    ...seminar,
    coordinator: getUser(seminar.coordinatorId),
    totalLessons: lessons.length,
    totalDurationSeconds: lessons.reduce((acc, l) => acc + (l.durationSeconds ?? 0), 0),
    enrolledCount: enrollments.length,
  };
}

const usersService: UsersService = {
  async list() {
    await delay();
    return [...(db.list("users") as User[])];
  },
  async byId(id) {
    await delay();
    return getUser(id);
  },
  async byEmail(email) {
    await delay();
    return (db.list("users") as User[]).find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  },
  async create({ email, fullName, role, coordinatorStatus }) {
    await delay();
    if (role !== "super_admin" && role !== "coordinator" && role !== "participant") {
      throw new ValidationError("Papel inválido.");
    }
    const existing = (db.list("users") as User[]).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) throw new ValidationError("Já existe um usuário com esse e-mail.");
    const user: User = {
      id: genId("u"),
      email,
      fullName,
      role,
      coordinatorStatus: role === "coordinator" ? coordinatorStatus ?? "active" : null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    db.insert("users", user);
    return user;
  },
  async setCoordinatorStatus(id, status, actor) {
    await delay();
    requireSuperAdmin(actor);
    const target = getUser(id);
    if (!target) throw new NotFoundError("Coordenador não encontrado.");
    if (target.role !== "coordinator") throw new ValidationError("Usuário não é coordenador.");
    const updated: User = { ...target, coordinatorStatus: status, updatedAt: nowIso() };
    db.upsert("users", (u: User) => u.id === id, updated);
    return updated;
  },
};

const seminarsService: SeminarsService = {
  async list(opts) {
    await delay();
    let seminars = db.list("seminars") as Seminar[];
    if (opts?.status) seminars = seminars.filter((s) => s.status === opts.status);
    if (opts?.coordinatorId) seminars = seminars.filter((s) => s.coordinatorId === opts.coordinatorId);
    return seminars.map(buildSeminarMeta);
  },
  async byId(id) {
    await delay();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === id);
    return seminar ? buildSeminarMeta(seminar) : null;
  },
  async bySlug(slug) {
    await delay();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.slug === slug);
    return seminar ? buildSeminarMeta(seminar) : null;
  },
  async create(input, actor) {
    await delay();
    requireCoordinatorOrAdmin(actor);
    if (!input.endDate) throw new ValidationError("Seminário precisa ter data de término.");
    if (!input.title?.trim()) throw new ValidationError("Título obrigatório.");
    const baseSlug = slugify(input.title);
    let slug = baseSlug;
    let n = 1;
    while ((db.list("seminars") as Seminar[]).find((s) => s.slug === slug)) {
      n += 1;
      slug = `${baseSlug}-${n}`;
    }
    const seminar: Seminar = {
      id: genId("s"),
      slug,
      title: input.title,
      description: input.description ?? "",
      coordinatorId: input.coordinatorId ?? actor.id,
      startDate: input.startDate,
      endDate: input.endDate,
      status: input.status ?? "draft",
      maxSeats: input.maxSeats ?? null,
      coverImageUrl: input.coverImageUrl ?? null,
      area: input.area ?? null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    db.insert("seminars", seminar);
    return seminar;
  },
  async update(id, patch, actor) {
    await delay();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === id);
    if (!seminar) throw new NotFoundError();
    if (!canManageSeminar(actor, seminar)) throw new PermissionError();
    const updated: Seminar = { ...seminar, ...patch, updatedAt: nowIso() };
    db.upsert("seminars", (s: Seminar) => s.id === id, updated);
    return updated;
  },
  async publish(id, actor) {
    await delay();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === id);
    if (!seminar) throw new NotFoundError();
    if (!canManageSeminar(actor, seminar)) throw new PermissionError();
    if (!seminar.endDate) throw new ValidationError("Defina a data de término antes de publicar.");
    const updated: Seminar = { ...seminar, status: "published", updatedAt: nowIso() };
    db.upsert("seminars", (s: Seminar) => s.id === id, updated);
    return updated;
  },
  async remove(id, actor) {
    await delay();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === id);
    if (!seminar) throw new NotFoundError();
    if (!canManageSeminar(actor, seminar)) throw new PermissionError();
    db.remove("seminars", (s: Seminar) => s.id === id);
  },
  async structure(id) {
    await delay();
    const modules = (db.list("modules") as Module[])
      .filter((m) => m.seminarId === id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    const lessons = (db.list("lessons") as Lesson[]).filter((l) => l.seminarId === id);
    const structured: ModuleWithLessons[] = modules.map((m) => ({
      ...m,
      lessons: lessons
        .filter((l) => l.moduleId === m.id)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((l) => ({ ...l })),
    }));
    return { modules: structured, lessons };
  },
};

const modulesService: ModulesService = {
  async listBySeminar(seminarId) {
    await delay();
    return (db.list("modules") as Module[])
      .filter((m) => m.seminarId === seminarId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  },
  async create(input, actor) {
    await delay();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === input.seminarId);
    if (!seminar) throw new NotFoundError();
    if (!canManageSeminar(actor, seminar)) throw new PermissionError();
    const m: Module = { ...input, id: genId("m"), createdAt: nowIso() };
    db.insert("modules", m);
    return m;
  },
  async update(id, patch, actor) {
    await delay();
    const m = (db.list("modules") as Module[]).find((x) => x.id === id);
    if (!m) throw new NotFoundError();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === m.seminarId);
    if (!seminar || !canManageSeminar(actor, seminar)) throw new PermissionError();
    const updated: Module = { ...m, ...patch };
    db.upsert("modules", (x: Module) => x.id === id, updated);
    return updated;
  },
  async remove(id, actor) {
    await delay();
    const m = (db.list("modules") as Module[]).find((x) => x.id === id);
    if (!m) throw new NotFoundError();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === m.seminarId);
    if (!seminar || !canManageSeminar(actor, seminar)) throw new PermissionError();
    db.remove("modules", (x: Module) => x.id === id);
  },
  async reorder(seminarId, orderedIds, actor) {
    await delay();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === seminarId);
    if (!seminar) throw new NotFoundError();
    if (!canManageSeminar(actor, seminar)) throw new PermissionError();
    orderedIds.forEach((id, idx) => {
      db.upsert("modules", (m: Module) => m.id === id, { orderIndex: idx + 1 });
    });
  },
};

const lessonsService: LessonsService = {
  async listByModule(moduleId) {
    await delay();
    return (db.list("lessons") as Lesson[])
      .filter((l) => l.moduleId === moduleId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  },
  async listBySeminar(seminarId) {
    await delay();
    return (db.list("lessons") as Lesson[]).filter((l) => l.seminarId === seminarId);
  },
  async byId(id) {
    await delay();
    return (db.list("lessons") as Lesson[]).find((l) => l.id === id) ?? null;
  },
  async create(input, actor) {
    await delay();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === input.seminarId);
    if (!seminar) throw new NotFoundError();
    if (!canManageSeminar(actor, seminar)) throw new PermissionError();
    const lesson: Lesson = { ...input, id: genId("l"), createdAt: nowIso() };
    db.insert("lessons", lesson);
    return lesson;
  },
  async update(id, patch, actor) {
    await delay();
    const lesson = (db.list("lessons") as Lesson[]).find((l) => l.id === id);
    if (!lesson) throw new NotFoundError();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === lesson.seminarId);
    if (!seminar || !canManageSeminar(actor, seminar)) throw new PermissionError();
    const updated: Lesson = { ...lesson, ...patch };
    db.upsert("lessons", (l: Lesson) => l.id === id, updated);
    return updated;
  },
  async remove(id, actor) {
    await delay();
    const lesson = (db.list("lessons") as Lesson[]).find((l) => l.id === id);
    if (!lesson) throw new NotFoundError();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === lesson.seminarId);
    if (!seminar || !canManageSeminar(actor, seminar)) throw new PermissionError();
    db.remove("lessons", (l: Lesson) => l.id === id);
  },
  async reorder(moduleId, orderedIds, actor) {
    await delay();
    const mod = (db.list("modules") as Module[]).find((m) => m.id === moduleId);
    if (!mod) throw new NotFoundError();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === mod.seminarId);
    if (!seminar || !canManageSeminar(actor, seminar)) throw new PermissionError();
    orderedIds.forEach((id, idx) => {
      db.upsert("lessons", (l: Lesson) => l.id === id, { orderIndex: idx + 1 });
    });
  },
  async withProgress(lessonId, userId) {
    await delay();
    const lesson = (db.list("lessons") as Lesson[]).find((l) => l.id === lessonId);
    if (!lesson) return null;
    const progress = (db.list("progress") as LessonProgress[]).find((p) => p.lessonId === lessonId && p.userId === userId) ?? null;
    return { ...lesson, progress };
  },
};

const enrollmentsService: EnrollmentsService = {
  async listByUser(userId) {
    await delay();
    const enrollments = (db.list("enrollments") as Enrollment[]).filter((e) => e.userId === userId);
    const seminars = db.list("seminars") as Seminar[];
    const lessons = db.list("lessons") as Lesson[];
    const progress = db.list("progress") as LessonProgress[];
    return enrollments.map((e) => {
      const seminar = seminars.find((s) => s.id === e.seminarId)!;
      const totalLessons = lessons.filter((l) => l.seminarId === seminar.id).length;
      const completedLessons = progress.filter((p) => p.seminarId === seminar.id && p.userId === userId && p.completed).length;
      const percent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
      return {
        ...e,
        seminar: buildSeminarMeta(seminar),
        attendance: {
          id: `att-${e.id}`,
          userId: e.userId,
          seminarId: e.seminarId,
          percentComplete: percent,
          totalLessons,
          completedLessons,
          updatedAt: nowIso(),
        },
      };
    });
  },
  async listBySeminar(seminarId) {
    await delay();
    const enrollments = (db.list("enrollments") as Enrollment[]).filter((e) => e.seminarId === seminarId);
    const lessons = (db.list("lessons") as Lesson[]).filter((l) => l.seminarId === seminarId);
    const progress = db.list("progress") as LessonProgress[];
    return enrollments.map((e) => {
      const user = getUser(e.userId)!;
      const completedLessons = progress.filter((p) => p.userId === user.id && p.seminarId === seminarId && p.completed).length;
      const percent = lessons.length === 0 ? 0 : Math.round((completedLessons / lessons.length) * 100);
      return {
        ...e,
        user,
        attendance: {
          id: `att-${e.id}`,
          userId: e.userId,
          seminarId,
          percentComplete: percent,
          totalLessons: lessons.length,
          completedLessons,
          updatedAt: nowIso(),
        },
      };
    });
  },
  async enroll(userId, seminarId, actor) {
    await delay();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === seminarId);
    if (!seminar) throw new NotFoundError();
    if (actor.role !== "super_admin" && !(actor.role === "coordinator" && actor.coordinatorStatus === "active" && seminar.coordinatorId === actor.id)) {
      throw new PermissionError("Apenas o coordenador responsável pode inscrever participantes.");
    }
    const exists = (db.list("enrollments") as Enrollment[]).find((e) => e.userId === userId && e.seminarId === seminarId);
    if (exists) return exists;
    const enrollment: Enrollment = {
      id: genId("e"),
      userId,
      seminarId,
      enrolledAt: nowIso(),
      enrolledBy: actor.id,
      status: "active",
    };
    db.insert("enrollments", enrollment);
    return enrollment;
  },
  async remove(enrollmentId, actor) {
    await delay();
    const enrollment = (db.list("enrollments") as Enrollment[]).find((e) => e.id === enrollmentId);
    if (!enrollment) throw new NotFoundError();
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === enrollment.seminarId);
    if (!seminar) throw new NotFoundError();
    if (!canManageSeminar(actor, seminar)) throw new PermissionError();
    db.remove("enrollments", (e: Enrollment) => e.id === enrollmentId);
  },
  async isEnrolled(userId, seminarId) {
    await delay();
    return (db.list("enrollments") as Enrollment[]).some((e) => e.userId === userId && e.seminarId === seminarId && e.status === "active");
  },
};

const progressService: ProgressService = {
  async listByUser(userId) {
    await delay();
    return (db.list("progress") as LessonProgress[]).filter((p) => p.userId === userId);
  },
  async listBySeminar(seminarId) {
    await delay();
    return (db.list("progress") as LessonProgress[]).filter((p) => p.seminarId === seminarId);
  },
  async upsert(input, actor) {
    await delay();
    if (actor.role === "participant" && actor.id !== input.userId) {
      throw new PermissionError("Você só pode atualizar o próprio progresso.");
    }
    const existing = (db.list("progress") as LessonProgress[]).find((p) => p.userId === input.userId && p.lessonId === input.lessonId);
    const max = Math.min(100, Math.max(0, input.maxWatchedPercent));
    const completed = input.completed ?? ((existing?.completed ?? false) || max >= 100);
    const progress: LessonProgress = existing
      ? {
          ...existing,
          maxWatchedPercent: Math.max(existing.maxWatchedPercent, max),
          completed: completed || existing.completed,
          completedAt: existing.completedAt ?? (completed ? nowIso() : null),
          lastUpdatedAt: nowIso(),
        }
      : {
          id: genId("p"),
          userId: input.userId,
          lessonId: input.lessonId,
          seminarId: input.seminarId,
          maxWatchedPercent: max,
          completed,
          completedAt: completed ? nowIso() : null,
          lastUpdatedAt: nowIso(),
        };
    db.upsert("progress", (p: LessonProgress) => p.userId === input.userId && p.lessonId === input.lessonId, progress);
    return progress;
  },
  async markCompleted(lessonId, userId, actor) {
    return this.upsert({ userId, lessonId, seminarId: (db.list("lessons") as Lesson[]).find((l) => l.id === lessonId)?.seminarId ?? "", maxWatchedPercent: 100, completed: true }, actor);
  },
  async seminarProgressForUser(seminarId, userId) {
    await delay();
    const lessons = (db.list("lessons") as Lesson[]).filter((l) => l.seminarId === seminarId);
    const progress = (db.list("progress") as LessonProgress[]).filter((p) => p.seminarId === seminarId && p.userId === userId);
    const completed = progress.filter((p) => p.completed).length;
    const total = lessons.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { completed, total, percent };
  },
  async seminarOverviewForCoordinator(seminarId) {
    await delay();
    const enrollments = (db.list("enrollments") as Enrollment[]).filter((e) => e.seminarId === seminarId);
    const lessons = (db.list("lessons") as Lesson[]).filter((l) => l.seminarId === seminarId);
    const progress = (db.list("progress") as LessonProgress[]).filter((p) => p.seminarId === seminarId);
    return enrollments.map((e) => {
      const user = getUser(e.userId)!;
      const completed = progress.filter((p) => p.userId === user.id && p.completed).length;
      const total = lessons.length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { user, completed, total, percent };
    });
  },
};

const certificatesService: CertificatesService = {
  async listByUser(userId) {
    await delay();
    const certs = (db.list("certificates") as Certificate[]).filter((c) => c.userId === userId);
    const seminars = db.list("seminars") as Seminar[];
    const users = db.list("users") as User[];
    return certs.map((c) => {
      const seminar = seminars.find((s) => s.id === c.seminarId)!;
      const user = users.find((u) => u.id === c.userId)!;
      return { ...c, seminar: buildSeminarMeta(seminar), user };
    });
  },
  async byValidationCode(code) {
    await delay();
    const cert = (db.list("certificates") as Certificate[]).find((c) => c.validationCode === code);
    if (!cert) return null;
    const user = getUser(cert.userId);
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === cert.seminarId);
    if (!user || !seminar) return null;
    return {
      ...cert,
      user: { fullName: user.fullName },
      seminar: { title: seminar.title, endDate: seminar.endDate },
    };
  },
  async byId(id) {
    await delay();
    return (db.list("certificates") as Certificate[]).find((c) => c.id === id) ?? null;
  },
  async issue({ userId, seminarId }, actor, opts) {
    await delay();
    if (!opts?.manual) requireSuperAdmin(actor);
    const user = getUser(userId);
    if (!user) throw new NotFoundError("Usuário não encontrado.");
    const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === seminarId);
    if (!seminar) throw new NotFoundError("Seminário não encontrado.");
    const existing = (db.list("certificates") as Certificate[]).find((c) => c.userId === userId && c.seminarId === seminarId && !c.revoked);
    if (existing) return existing;
    const cert: Certificate = {
      id: genId("c"),
      userId,
      seminarId,
      issuedAt: nowIso(),
      validationCode: genValidationCode(),
      issuedBy: actor.id,
      revoked: false,
    };
    db.insert("certificates", cert);
    return cert;
  },
  async revoke(id, reason, actor) {
    await delay();
    requireSuperAdmin(actor);
    const cert = (db.list("certificates") as Certificate[]).find((c) => c.id === id);
    if (!cert) throw new NotFoundError();
    const updated: Certificate = {
      ...cert,
      revoked: true,
      revokedAt: nowIso(),
      revokedReason: reason,
    };
    db.upsert("certificates", (c: Certificate) => c.id === id, updated);
    return updated;
  },
};

const articlesService: ArticlesService = {
  async listBySeminar(seminarId) {
    await delay();
    return (db.list("articles") as Article[]).filter((a) => a.seminarId === seminarId);
  },
  async create(input, actor) {
    await delay();
    requireCoordinatorOrAdmin(actor);
    const a: Article = { ...input, id: genId("a"), createdAt: nowIso() };
    db.insert("articles", a);
    return a;
  },
  async remove(id, actor) {
    await delay();
    requireCoordinatorOrAdmin(actor);
    db.remove("articles", (a: Article) => a.id === id);
  },
};

const settingsService: SettingsService = {
  async list() {
    await delay();
    return [...(db.list("settings") as Settings[])];
  },
  async get<T = unknown>(key: string) {
    await delay();
    const s = (db.list("settings") as Settings[]).find((x) => x.key === key);
    return (s?.value as T | null) ?? null;
  },
  async set(key, value, actor) {
    await delay();
    requireSuperAdmin(actor);
    const existing = (db.list("settings") as Settings[]).find((s) => s.key === key);
    const setting: Settings = { key, value, updatedAt: nowIso() };
    db.upsert("settings", (s: Settings) => s.key === key, setting);
    return setting;
  },
};

const auditService: AuditService = {
  async list() {
    await delay();
    const logs = [...(db.list("auditLogs") as AuditLog[])].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const users = db.list("users") as User[];
    return logs.map((l) => ({ ...l, actor: users.find((u) => u.id === l.actorId) ?? null }));
  },
  async log(action, actor, meta) {
    await delay();
    requireUser(actor);
    const log: AuditLog = {
      id: genId("al"),
      actorId: actor.id,
      action,
      targetTable: meta?.targetTable ?? null,
      targetId: meta?.targetId ?? null,
      metadata: meta?.metadata ?? null,
      createdAt: nowIso(),
    };
    db.insert("auditLogs", log);
    return log;
  },
};

const authService: AuthService = {
  async currentUser() {
    await delay(20);
    const { userId } = session.read();
    return userId ? getUser(userId) : null;
  },
  async setCurrentUser(userId) {
    session.write({ userId });
    return userId ? getUser(userId) : null;
  },
  async loginAs(userId) {
    const user = getUser(userId);
    if (!user) throw new NotFoundError("Usuário não encontrado.");
    session.write({ userId: user.id });
    return user;
  },
  async logout() {
    session.clear();
  },
};

export const mockServices: Services = {
  users: usersService,
  seminars: seminarsService,
  modules: modulesService,
  lessons: lessonsService,
  enrollments: enrollmentsService,
  progress: progressService,
  certificates: certificatesService,
  articles: articlesService,
  settings: settingsService,
  audit: auditService,
  auth: authService,
};
