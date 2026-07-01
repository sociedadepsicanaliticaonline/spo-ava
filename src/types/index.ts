export type Role = "participant" | "coordinator" | "super_admin";

export type CoordinatorStatus = "active" | "suspended";

export type AssociationStatus = "membro" | "aspirante" | "visitante";

export type SeminarStatus = "draft" | "published" | "archived";

export type EnrollmentStatus = "active" | "cancelled";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  coordinatorStatus?: CoordinatorStatus | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  userId: string;
  bio?: string | null;
  phone?: string | null;
  associationStatus?: AssociationStatus | null;
  avatarUrl?: string | null;
}

export interface Seminar {
  id: string;
  slug: string;
  title: string;
  description: string;
  coordinatorId: string;
  startDate: string;
  endDate: string;
  status: SeminarStatus;
  maxSeats?: number | null;
  coverImageUrl?: string | null;
  area?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  seminarId: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  seminarId: string;
  title: string;
  description?: string | null;
  youtubeUrl: string;
  youtubeVideoId: string;
  durationSeconds?: number | null;
  orderIndex: number;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  seminarId: string;
  enrolledAt: string;
  enrolledBy: string;
  status: EnrollmentStatus;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  seminarId: string;
  maxWatchedPercent: number;
  completed: boolean;
  completedAt?: string | null;
  lastUpdatedAt: string;
}

export interface Attendance {
  id: string;
  userId: string;
  seminarId: string;
  percentComplete: number;
  totalLessons: number;
  completedLessons: number;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  seminarId: string;
  issuedAt: string;
  pdfUrl?: string | null;
  validationCode: string;
  issuedBy?: string | null;
  revoked: boolean;
  revokedAt?: string | null;
  revokedReason?: string | null;
}

export interface Article {
  id: string;
  seminarId?: string | null;
  title: string;
  description?: string | null;
  fileUrl: string;
  fileType: "pdf" | "docx" | "pptx" | "link";
  createdAt: string;
}

export interface Settings {
  key: string;
  value: unknown;
  updatedAt: string;
}

export type AuditAction =
  | "coordinator.created"
  | "coordinator.suspended"
  | "coordinator.reactivated"
  | "seminar.created"
  | "seminar.updated"
  | "seminar.deleted"
  | "seminar.published"
  | "lesson.created"
  | "lesson.updated"
  | "enrollment.created"
  | "enrollment.removed"
  | "certificate.issued_auto"
  | "certificate.issued_manual"
  | "certificate.revoked"
  | "settings.updated";

export interface AuditLog {
  id: string;
  actorId: string;
  action: AuditAction;
  targetTable?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface SeminarWithMeta extends Seminar {
  coordinator?: User | null;
  totalLessons: number;
  totalDurationSeconds: number;
  enrolledCount: number;
}

export interface LessonWithProgress extends Lesson {
  progress?: LessonProgress | null;
}

export interface ModuleWithLessons extends Module {
  lessons: LessonWithLessons[];
}

export interface LessonWithLessons extends Lesson {
  progress?: LessonProgress | null;
}

export interface EnrollmentWithSeminar extends Enrollment {
  seminar: Seminar;
  attendance: Attendance;
}

export interface EnrollmentWithUser extends Enrollment {
  user: User;
  attendance: Attendance;
}

export interface CertificateWithSeminar extends Certificate {
  seminar: Seminar;
  user: User;
}
