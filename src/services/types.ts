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

export class PermissionError extends Error {
  status = 403;
  constructor(message = "Você não tem permissão para realizar essa ação.") {
    super(message);
    this.name = "PermissionError";
  }
}

export class NotFoundError extends Error {
  status = 404;
  constructor(message = "Recurso não encontrado.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  status = 422;
  constructor(message = "Dados inválidos.") {
    super(message);
    this.name = "ValidationError";
  }
}

export interface UsersService {
  list(): Promise<User[]>;
  byId(id: string): Promise<User | null>;
  byEmail(email: string): Promise<User | null>;
  create(input: { email: string; fullName: string; role: Role; coordinatorStatus?: "active" | "suspended" | null }): Promise<User>;
  setCoordinatorStatus(id: string, status: "active" | "suspended", actor: User): Promise<User>;
}

export interface SeminarsService {
  list(opts?: { status?: Seminar["status"]; coordinatorId?: string }): Promise<SeminarWithMeta[]>;
  byId(id: string): Promise<SeminarWithMeta | null>;
  bySlug(slug: string): Promise<SeminarWithMeta | null>;
  create(input: Omit<Seminar, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string }, actor: User): Promise<Seminar>;
  update(id: string, patch: Partial<Seminar>, actor: User): Promise<Seminar>;
  publish(id: string, actor: User): Promise<Seminar>;
  remove(id: string, actor: User): Promise<void>;
  structure(id: string): Promise<{ modules: ModuleWithLessons[]; lessons: Lesson[] }>;
}

export interface ModulesService {
  listBySeminar(seminarId: string): Promise<Module[]>;
  create(input: Omit<Module, "id" | "createdAt">, actor: User): Promise<Module>;
  update(id: string, patch: Partial<Module>, actor: User): Promise<Module>;
  remove(id: string, actor: User): Promise<void>;
  reorder(seminarId: string, orderedIds: string[], actor: User): Promise<void>;
}

export interface LessonsService {
  listByModule(moduleId: string): Promise<Lesson[]>;
  listBySeminar(seminarId: string): Promise<Lesson[]>;
  byId(id: string): Promise<Lesson | null>;
  create(input: Omit<Lesson, "id" | "createdAt">, actor: User): Promise<Lesson>;
  update(id: string, patch: Partial<Lesson>, actor: User): Promise<Lesson>;
  remove(id: string, actor: User): Promise<void>;
  reorder(moduleId: string, orderedIds: string[], actor: User): Promise<void>;
  withProgress(lessonId: string, userId: string): Promise<LessonWithProgress | null>;
}

export interface EnrollmentsService {
  listByUser(userId: string): Promise<EnrollmentWithSeminar[]>;
  listBySeminar(seminarId: string): Promise<EnrollmentWithUser[]>;
  enroll(userId: string, seminarId: string, actor: User): Promise<Enrollment>;
  remove(enrollmentId: string, actor: User): Promise<void>;
  isEnrolled(userId: string, seminarId: string): Promise<boolean>;
}

export interface ProgressService {
  listByUser(userId: string): Promise<LessonProgress[]>;
  listBySeminar(seminarId: string): Promise<LessonProgress[]>;
  upsert(input: { userId: string; lessonId: string; seminarId: string; maxWatchedPercent: number; completed?: boolean }, actor: User): Promise<LessonProgress>;
  markCompleted(lessonId: string, userId: string, actor: User): Promise<LessonProgress>;
  seminarProgressForUser(seminarId: string, userId: string): Promise<{ completed: number; total: number; percent: number }>;
  seminarOverviewForCoordinator(seminarId: string): Promise<{ user: User; completed: number; total: number; percent: number }[]>;
}

export interface CertificatesService {
  listByUser(userId: string): Promise<CertificateWithSeminar[]>;
  byValidationCode(code: string): Promise<(Certificate & { user: Pick<User, "fullName">; seminar: Pick<Seminar, "title" | "endDate"> }) | null>;
  byId(id: string): Promise<Certificate | null>;
  issue(input: { userId: string; seminarId: string }, actor: User, opts?: { manual?: boolean }): Promise<Certificate>;
  revoke(id: string, reason: string, actor: User): Promise<Certificate>;
}

export interface ArticlesService {
  listBySeminar(seminarId: string): Promise<Article[]>;
  create(input: Omit<Article, "id" | "createdAt">, actor: User): Promise<Article>;
  remove(id: string, actor: User): Promise<void>;
}

export interface SettingsService {
  list(): Promise<Settings[]>;
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown, actor: User): Promise<Settings>;
}

export interface AuditService {
  list(): Promise<(AuditLog & { actor?: User | null })[]>;
  log(action: AuditAction, actor: User, meta?: { targetTable?: string; targetId?: string; metadata?: Record<string, unknown> }): Promise<AuditLog>;
}

export interface AuthService {
  currentUser(): Promise<User | null>;
  setCurrentUser(userId: string | null): Promise<User | null>;
  loginAs(userId: string): Promise<User>;
  logout(): Promise<void>;
}

export interface Services {
  users: UsersService;
  seminars: SeminarsService;
  modules: ModulesService;
  lessons: LessonsService;
  enrollments: EnrollmentsService;
  progress: ProgressService;
  certificates: CertificatesService;
  articles: ArticlesService;
  settings: SettingsService;
  audit: AuditService;
  auth: AuthService;
}
