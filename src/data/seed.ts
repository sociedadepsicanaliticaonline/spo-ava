import type {
  Article,
  AuditLog,
  Certificate,
  Enrollment,
  Lesson,
  LessonProgress,
  Module,
  Profile,
  Seminar,
  Settings,
  User,
} from "@/types";

const now = new Date();
const isoNow = now.toISOString();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();
const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000).toISOString();

export const seedUsers: User[] = [
  {
    id: "u-admin-1",
    email: "admin@spo.test",
    fullName: "Sofia Almeida",
    role: "super_admin",
    createdAt: daysAgo(120),
    updatedAt: daysAgo(5),
  },
  {
    id: "u-coord-1",
    email: "ana.coord@spo.test",
    fullName: "Ana Beatriz Moreira",
    role: "coordinator",
    coordinatorStatus: "active",
    createdAt: daysAgo(100),
    updatedAt: daysAgo(2),
  },
  {
    id: "u-coord-2",
    email: "paulo.coord@spo.test",
    fullName: "Paulo Henrique Salles",
    role: "coordinator",
    coordinatorStatus: "suspended",
    createdAt: daysAgo(80),
    updatedAt: daysAgo(7),
  },
  {
    id: "u-part-1",
    email: "alice@spo.test",
    fullName: "Alice Ferraz",
    role: "participant",
    createdAt: daysAgo(60),
    updatedAt: daysAgo(60),
  },
  {
    id: "u-part-2",
    email: "bruno@spo.test",
    fullName: "Bruno Cavalcanti",
    role: "participant",
    createdAt: daysAgo(45),
    updatedAt: daysAgo(45),
  },
  {
    id: "u-part-3",
    email: "clara@spo.test",
    fullName: "Clara Drummond",
    role: "participant",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(30),
  },
];

export const seedProfiles: Profile[] = [
  {
    userId: "u-admin-1",
    bio: "Coordenação geral da plataforma SPO Learning.",
    associationStatus: "membro",
  },
  {
    userId: "u-coord-1",
    bio: "Psicanalista, pesquisadora de clínica do contemporâneo.",
    associationStatus: "membro",
  },
  {
    userId: "u-coord-2",
    bio: "Teoria psicanalítica — ênfase em Freud e Lacan.",
    associationStatus: "membro",
  },
  {
    userId: "u-part-1",
    associationStatus: "aspirante",
  },
  {
    userId: "u-part-2",
    associationStatus: "membro",
  },
  {
    userId: "u-part-3",
    associationStatus: "visitante",
  },
];

export const seedSeminars: Seminar[] = [
  {
    id: "s-1",
    slug: "clinica-do-contemporaneo-2026",
    title: "Clínica do Contemporâneo",
    description:
      "Seminário teórico-clínico voltado para a escuta de novos sintomas e modos de sofrimento na atualidade, articulando psicanálise e cultura.",
    coordinatorId: "u-coord-1",
    startDate: daysAgo(20),
    endDate: daysFromNow(40),
    status: "published",
    maxSeats: null,
    coverImageUrl: null,
    area: "Clínica",
    createdAt: daysAgo(45),
    updatedAt: daysAgo(2),
  },
  {
    id: "s-2",
    slug: "leitura-de-freud-2025",
    title: "Leitura de Freud — Obras Completas",
    description:
      "Trajetória comentada pela obra freudiana, do Projeto para uma psicologia científica até Moisés e o monoteísmo.",
    coordinatorId: "u-coord-1",
    startDate: daysAgo(180),
    endDate: daysAgo(30),
    status: "published",
    maxSeats: null,
    coverImageUrl: null,
    area: "Teoria",
    createdAt: daysAgo(220),
    updatedAt: daysAgo(30),
  },
  {
    id: "s-3",
    slug: "lacan-e-o-real",
    title: "Lacan e o Real — Rascunho",
    description: "Seminário em construção. Estrutura inicial de módulos e aulas.",
    coordinatorId: "u-coord-2",
    startDate: daysFromNow(60),
    endDate: daysFromNow(150),
    status: "draft",
    maxSeats: null,
    coverImageUrl: null,
    area: "Teoria",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
];

export const seedModules: Module[] = [
  // s-1: 2 modules
  {
    id: "m-1-1",
    seminarId: "s-1",
    title: "Módulo 1 — Sintomas sociais",
    description: "Pânico, depressão, burnout e a clínica do laço social.",
    orderIndex: 1,
    createdAt: daysAgo(40),
  },
  {
    id: "m-1-2",
    seminarId: "s-1",
    title: "Módulo 2 — Corpo e contemporâneo",
    description: "Discurso capitalista, gozo e as novas formas de corpo.",
    orderIndex: 2,
    createdAt: daysAgo(20),
  },
  // s-2: 2 modules
  {
    id: "m-2-1",
    seminarId: "s-2",
    title: "Módulo 1 — Primeiros textos",
    description: "Estudos sobre a histeria, Projeto e Interpretação dos sonhos.",
    orderIndex: 1,
    createdAt: daysAgo(220),
  },
  {
    id: "m-2-2",
    seminarId: "s-2",
    title: "Módulo 2 — Textos tardios",
    description: "Mal-estar, Pulsão e Pulsões, Moisés e o monoteísmo.",
    orderIndex: 2,
    createdAt: daysAgo(120),
  },
  // s-3: 1 module
  {
    id: "m-3-1",
    seminarId: "s-3",
    title: "Módulo 1 — O conceito de Real",
    description: "Placeholders — conteúdo em desenvolvimento.",
    orderIndex: 1,
    createdAt: daysAgo(2),
  },
];

export const seedLessons: Lesson[] = [
  {
    id: "l-1-1-1",
    seminarId: "s-1",
    moduleId: "m-1-1",
    title: "Aula 1 — Pânico e laço social",
    description: "Introdução ao conceito de pânico na leitura lacaniana.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeVideoId: "dQw4w9WgXcQ",
    durationSeconds: 3600,
    orderIndex: 1,
    createdAt: daysAgo(20),
  },
  {
    id: "l-1-1-2",
    seminarId: "s-1",
    moduleId: "m-1-1",
    title: "Aula 2 — Depressão: clínica e diagnóstico",
    description: "Diferenças entre melancolia e depressão contemporânea.",
    youtubeUrl: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
    youtubeVideoId: "oHg5SJYRHA0",
    durationSeconds: 3000,
    orderIndex: 2,
    createdAt: daysAgo(15),
  },
  {
    id: "l-1-2-1",
    seminarId: "s-1",
    moduleId: "m-1-2",
    title: "Aula 3 — Discurso capitalista e corpo",
    description: "Gozo fálico, mais-de-gozar e as novas patologias.",
    youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    youtubeVideoId: "ScMzIvxBSi4",
    durationSeconds: 4200,
    orderIndex: 1,
    createdAt: daysAgo(8),
  },
  {
    id: "l-2-1-1",
    seminarId: "s-2",
    moduleId: "m-2-1",
    title: "Aula 1 — Estudos sobre a histeria",
    description: "Leitura do caso Anna O.",
    youtubeUrl: "https://www.youtube.com/watch?v=ZZ5LpwO-An4",
    youtubeVideoId: "ZZ5LpwO-An4",
    durationSeconds: 3300,
    orderIndex: 1,
    createdAt: daysAgo(170),
  },
  {
    id: "l-2-1-2",
    seminarId: "s-2",
    moduleId: "m-2-1",
    title: "Aula 2 — Interpretação dos sonhos",
    description: "O sonho como via régia para o inconsciente.",
    youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    youtubeVideoId: "kJQP7kiw5Fk",
    durationSeconds: 3900,
    orderIndex: 2,
    createdAt: daysAgo(140),
  },
  {
    id: "l-2-2-1",
    seminarId: "s-2",
    moduleId: "m-2-2",
    title: "Aula 3 — O mal-estar na civilização",
    description: "Agressividade e cultura.",
    youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    youtubeVideoId: "9bZkp7q19f0",
    durationSeconds: 3600,
    orderIndex: 1,
    createdAt: daysAgo(90),
  },
  {
    id: "l-2-2-2",
    seminarId: "s-2",
    moduleId: "m-2-2",
    title: "Aula 4 — Moisés e o monoteísmo",
    description: "O retorno do reprimido na cultura.",
    youtubeUrl: "https://www.youtube.com/watch?v=RgKAFK5djSk",
    youtubeVideoId: "RgKAFK5djSk",
    durationSeconds: 3300,
    orderIndex: 2,
    createdAt: daysAgo(35),
  },
  {
    id: "l-3-1-1",
    seminarId: "s-3",
    moduleId: "m-3-1",
    title: "Aula 1 — Imaginário, Simbólico e Real",
    description: "Conteúdo placeholder — em construção.",
    youtubeUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    youtubeVideoId: "OPf0YbXqDm0",
    durationSeconds: 1800,
    orderIndex: 1,
    createdAt: daysAgo(2),
  },
];

export const seedEnrollments: Enrollment[] = [
  { id: "e-1", userId: "u-part-1", seminarId: "s-1", enrolledAt: daysAgo(18), enrolledBy: "u-coord-1", status: "active" },
  { id: "e-2", userId: "u-part-2", seminarId: "s-1", enrolledAt: daysAgo(15), enrolledBy: "u-coord-1", status: "active" },
  { id: "e-3", userId: "u-part-3", seminarId: "s-1", enrolledAt: daysAgo(10), enrolledBy: "u-coord-1", status: "active" },
  { id: "e-4", userId: "u-part-1", seminarId: "s-2", enrolledAt: daysAgo(150), enrolledBy: "u-coord-1", status: "active" },
  { id: "e-5", userId: "u-part-2", seminarId: "s-2", enrolledAt: daysAgo(140), enrolledBy: "u-coord-1", status: "active" },
];

export const seedProgress: LessonProgress[] = [
  // Alice em s-1: aulas 1 e 2 completas, aula 3 em 60%
  {
    id: "p-1",
    userId: "u-part-1",
    lessonId: "l-1-1-1",
    seminarId: "s-1",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(10),
    lastUpdatedAt: daysAgo(10),
  },
  {
    id: "p-2",
    userId: "u-part-1",
    lessonId: "l-1-1-2",
    seminarId: "s-1",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(5),
    lastUpdatedAt: daysAgo(5),
  },
  {
    id: "p-3",
    userId: "u-part-1",
    lessonId: "l-1-2-1",
    seminarId: "s-1",
    maxWatchedPercent: 60,
    completed: false,
    lastUpdatedAt: daysAgo(2),
  },
  // Bruno em s-1: aula 1 completa, aula 2 em 80%
  {
    id: "p-4",
    userId: "u-part-2",
    lessonId: "l-1-1-1",
    seminarId: "s-1",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(8),
    lastUpdatedAt: daysAgo(8),
  },
  {
    id: "p-5",
    userId: "u-part-2",
    lessonId: "l-1-1-2",
    seminarId: "s-1",
    maxWatchedPercent: 80,
    completed: false,
    lastUpdatedAt: daysAgo(1),
  },
  // Clara em s-1: só aula 1
  {
    id: "p-6",
    userId: "u-part-3",
    lessonId: "l-1-1-1",
    seminarId: "s-1",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(4),
    lastUpdatedAt: daysAgo(4),
  },
  // Alice e Bruno em s-2: tudo concluído (certificado emitido)
  {
    id: "p-7",
    userId: "u-part-1",
    lessonId: "l-2-1-1",
    seminarId: "s-2",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(60),
    lastUpdatedAt: daysAgo(60),
  },
  {
    id: "p-8",
    userId: "u-part-1",
    lessonId: "l-2-1-2",
    seminarId: "s-2",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(55),
    lastUpdatedAt: daysAgo(55),
  },
  {
    id: "p-9",
    userId: "u-part-1",
    lessonId: "l-2-2-1",
    seminarId: "s-2",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(40),
    lastUpdatedAt: daysAgo(40),
  },
  {
    id: "p-10",
    userId: "u-part-1",
    lessonId: "l-2-2-2",
    seminarId: "s-2",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(31),
    lastUpdatedAt: daysAgo(31),
  },
  {
    id: "p-11",
    userId: "u-part-2",
    lessonId: "l-2-1-1",
    seminarId: "s-2",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(50),
    lastUpdatedAt: daysAgo(50),
  },
  {
    id: "p-12",
    userId: "u-part-2",
    lessonId: "l-2-1-2",
    seminarId: "s-2",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(45),
    lastUpdatedAt: daysAgo(45),
  },
  {
    id: "p-13",
    userId: "u-part-2",
    lessonId: "l-2-2-1",
    seminarId: "s-2",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(35),
    lastUpdatedAt: daysAgo(35),
  },
  {
    id: "p-14",
    userId: "u-part-2",
    lessonId: "l-2-2-2",
    seminarId: "s-2",
    maxWatchedPercent: 100,
    completed: true,
    completedAt: daysAgo(31),
    lastUpdatedAt: daysAgo(31),
  },
];

export const seedCertificates: Certificate[] = [
  {
    id: "c-1",
    userId: "u-part-1",
    seminarId: "s-2",
    issuedAt: daysAgo(30),
    validationCode: "SPO-LEIT-FREUD-A1B2",
    issuedBy: null,
    revoked: false,
  },
  {
    id: "c-2",
    userId: "u-part-2",
    seminarId: "s-2",
    issuedAt: daysAgo(30),
    validationCode: "SPO-LEIT-FREUD-C3D4",
    issuedBy: null,
    revoked: false,
  },
];

export const seedArticles: Article[] = [
  {
    id: "a-1",
    seminarId: "s-1",
    title: "Texto de apoio — Mal-estar na cultura",
    description: "PDF com excertos selecionados.",
    fileUrl: "https://example.com/files/mal-estar.pdf",
    fileType: "pdf",
    createdAt: daysAgo(20),
  },
  {
    id: "a-2",
    seminarId: "s-1",
    title: "Bibliografia comentada — Módulo 1",
    fileUrl: "https://example.com/files/biblio-mod1.pdf",
    fileType: "pdf",
    createdAt: daysAgo(15),
  },
];

export const seedAuditLogs: AuditLog[] = [
  {
    id: "al-1",
    actorId: "u-admin-1",
    action: "coordinator.suspended",
    targetTable: "users",
    targetId: "u-coord-2",
    metadata: { motivo: "Solicitação de revisão administrativa" },
    createdAt: daysAgo(7),
  },
  {
    id: "al-2",
    actorId: "u-admin-1",
    action: "coordinator.created",
    targetTable: "users",
    targetId: "u-coord-1",
    metadata: { nome: "Ana Beatriz Moreira" },
    createdAt: daysAgo(100),
  },
  {
    id: "al-3",
    actorId: "u-admin-1",
    action: "certificate.issued_auto",
    targetTable: "certificates",
    targetId: "c-1",
    metadata: { seminarId: "s-2", userId: "u-part-1" },
    createdAt: daysAgo(30),
  },
  {
    id: "al-4",
    actorId: "u-admin-1",
    action: "certificate.issued_auto",
    targetTable: "certificates",
    targetId: "c-2",
    metadata: { seminarId: "s-2", userId: "u-part-2" },
    createdAt: daysAgo(30),
  },
];

export const seedSettings: Settings[] = [
  { key: "completion_threshold_percent", value: 95, updatedAt: isoNow },
  { key: "platform_name", value: "SPO Learning", updatedAt: isoNow },
  { key: "auto_issue_certificates", value: true, updatedAt: isoNow },
];

export interface SeedData {
  users: User[];
  profiles: Profile[];
  seminars: Seminar[];
  modules: Module[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  progress: LessonProgress[];
  certificates: Certificate[];
  articles: Article[];
  auditLogs: AuditLog[];
  settings: Settings[];
}

export const initialSeed: SeedData = {
  users: seedUsers,
  profiles: seedProfiles,
  seminars: seedSeminars,
  modules: seedModules,
  lessons: seedLessons,
  enrollments: seedEnrollments,
  progress: seedProgress,
  certificates: seedCertificates,
  articles: seedArticles,
  auditLogs: seedAuditLogs,
  settings: seedSettings,
};
