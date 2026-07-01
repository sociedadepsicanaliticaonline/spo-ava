import { z } from "zod";

const requiredString = (min = 2, label = "campo") =>
  z.string().trim().min(min, `${label} é obrigatório`);

const optionalString = z.string().trim().max(2000).optional();

export const seminarSchema = z
  .object({
    title: requiredString(3, "Título"),
    description: optionalString,
    area: z.string().trim().max(60).optional(),
    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().min(1, "Data de término é obrigatória"),
    status: z.enum(["draft", "published"]),
  })
  .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
    message: "Data de término deve ser posterior à data de início",
    path: ["endDate"],
  });
export type SeminarFormValues = z.infer<typeof seminarSchema>;

export const moduleSchema = z.object({
  title: requiredString(2, "Título"),
  description: optionalString,
});
export type ModuleFormValues = z.infer<typeof moduleSchema>;

export const lessonSchema = z.object({
  title: requiredString(2, "Título"),
  youtubeUrl: z
    .string()
    .trim()
    .min(1, "URL do YouTube é obrigatória")
    .url("URL inválida")
    .refine(
      (v) => /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/i.test(v),
      "URL deve ser do YouTube"
    ),
  description: optionalString,
});
export type LessonFormValues = z.infer<typeof lessonSchema>;

export const coordinatorSchema = z.object({
  fullName: requiredString(3, "Nome"),
  email: z.string().trim().email("E-mail inválido"),
});
export type CoordinatorFormValues = z.infer<typeof coordinatorSchema>;

export const articleSchema = z.object({
  title: requiredString(2, "Título"),
  description: z.string().trim().max(300).optional(),
  fileUrl: z.string().trim().url("URL inválida").min(1, "URL é obrigatória"),
  fileType: z.enum(["pdf", "docx", "pptx", "link"]),
});
export type ArticleFormValues = z.infer<typeof articleSchema>;
