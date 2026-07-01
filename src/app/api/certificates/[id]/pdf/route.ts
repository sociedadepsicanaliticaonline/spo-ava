import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, PageSizes, degrees } from "pdf-lib";
import QRCode from "qrcode";
import { promises as fs } from "fs";
import path from "path";
import { db } from "@/data/store";
import type { Certificate, Lesson, Seminar, User } from "@/types";

export const runtime = "nodejs";

const COLORS = {
  primary: rgb(46 / 255, 83 / 255, 157 / 255),
  primaryDark: rgb(32 / 255, 38 / 255, 70 / 255),
  accent: rgb(122 / 255, 45 / 255, 46 / 255),
  text: rgb(47 / 255, 54 / 255, 64 / 255),
  textLight: rgb(124 / 255, 133 / 255, 148 / 255),
  border: rgb(230 / 255, 234 / 255, 240 / 255),
  surface: rgb(245 / 255, 247 / 255, 250 / 255),
};

function formatDateBR(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatHours(seconds: number) {
  const hours = Math.round(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}h${minutes}min`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}min`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = (db.list("certificates") as Certificate[]).find((c) => c.id === id);
  if (!cert) return new NextResponse("Certificado não encontrado", { status: 404 });

  const user = (db.list("users") as User[]).find((u) => u.id === cert.userId);
  const seminar = (db.list("seminars") as Seminar[]).find((s) => s.id === cert.seminarId);
  if (!user || !seminar) return new NextResponse("Dados do certificado incompletos", { status: 404 });

  const lessons = (db.list("lessons") as Lesson[]).filter((l) => l.seminarId === seminar.id);
  const totalSeconds = lessons.reduce((acc, l) => acc + (l.durationSeconds ?? 0), 0);
  const origin = new URL(_req.url).origin;
  const validateUrl = `${origin}/certificados/validar/${cert.validationCode}`;
  const qrDataUrl = await QRCode.toDataURL(validateUrl, { width: 240, margin: 1, color: { dark: "#202646", light: "#ffffff" } });

  const pdf = await PDFDocument.create();
  pdf.setTitle(`Certificado — ${user.fullName} — ${seminar.title}`);
  pdf.setAuthor("Sociedade Psicanalítica Online");
  pdf.setSubject("Certificado de Conclusão");
  pdf.setCreator("SPO Learning");

  const landscape = PageSizes.A4; // vamos rotacionar
  const page = pdf.addPage([landscape[1], landscape[0]]);
  const { width, height } = page.getSize();

  const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const times = await pdf.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  void times;

  // Fundo
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

  // Moldura externa
  const m = 24;
  page.drawRectangle({ x: m, y: m, width: width - 2 * m, height: height - 2 * m, borderColor: COLORS.primary, borderWidth: 1.5 });
  page.drawRectangle({ x: m + 6, y: m + 6, width: width - 2 * (m + 6), height: height - 2 * (m + 6), borderColor: COLORS.primary, borderWidth: 0.5 });

  // Faixa superior
  page.drawRectangle({ x: m, y: height - m - 70, width: width - 2 * m, height: 70, color: COLORS.primaryDark });

  // Logo no canto esquerdo da faixa (versão para fundo escuro)
  try {
    const logoPath = path.join(process.cwd(), "src", "assets", "logo-02.png");
    const logoBytes = await fs.readFile(logoPath);
    const logoImg = await pdf.embedPng(logoBytes);
    const logoHeight = 40;
    const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
    page.drawImage(logoImg, {
      x: m + 20,
      y: height - m - 50,
      width: logoWidth,
      height: logoHeight,
    });
  } catch {
    // fallback textual se a logo não estiver disponível
    page.drawText("SOCIEDADE PSICANALÍTICA ONLINE", {
      x: m + 30,
      y: height - m - 32,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
  }
  page.drawText("Plataforma de Formação Continuada", {
    x: m + 30,
    y: height - m - 56,
    size: 7,
    font: helvetica,
    color: rgb(0.8, 0.85, 1),
  });
  // Identificador à direita
  page.drawText("CERTIFICADO", {
    x: width - m - 110,
    y: height - m - 32,
    size: 12,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  page.drawText(`Código: ${cert.validationCode}`, {
    x: width - m - 200,
    y: height - m - 50,
    size: 8,
    font: helvetica,
    color: rgb(0.8, 0.85, 1),
  });

  // Título principal
  const title = "Certificado de Conclusão";
  const titleSize = 32;
  const titleWidth = timesBold.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y: height - m - 130,
    size: titleSize,
    font: timesBold,
    color: COLORS.primaryDark,
  });

  // Subtítulo
  const sub = "Outorgado pela Sociedade Psicanalítica Online";
  const subSize = 11;
  const subWidth = helvetica.widthOfTextAtSize(sub, subSize);
  page.drawText(sub, {
    x: (width - subWidth) / 2,
    y: height - m - 155,
    size: subSize,
    font: helvetica,
    color: COLORS.textLight,
  });

  // Linha divisória
  page.drawLine({
    start: { x: width / 2 - 60, y: height - m - 175 },
    end: { x: width / 2 + 60, y: height - m - 175 },
    color: COLORS.accent,
    thickness: 1.5,
  });

  // Texto "Certificamos que"
  const certify1 = "Certificamos que";
  const c1Size = 12;
  const c1Width = helvetica.widthOfTextAtSize(certify1, c1Size);
  page.drawText(certify1, {
    x: (width - c1Width) / 2,
    y: height - m - 215,
    size: c1Size,
    font: helvetica,
    color: COLORS.text,
  });

  // Nome do aluno
  const nameSize = 28;
  const nameWidth = timesBold.widthOfTextAtSize(user.fullName, nameSize);
  page.drawText(user.fullName, {
    x: (width - nameWidth) / 2,
    y: height - m - 260,
    size: nameSize,
    font: timesBold,
    color: COLORS.primary,
  });

  // Texto descritivo
  const body = [
    `concluiu integralmente o seminário`,
  ];
  let cursorY = height - m - 295;
  for (const line of body) {
    const w = helvetica.widthOfTextAtSize(line, 12);
    page.drawText(line, { x: (width - w) / 2, y: cursorY, size: 12, font: helvetica, color: COLORS.text });
    cursorY -= 16;
  }

  // Título do seminário
  const seminarSize = 18;
  const seminarW = timesBold.widthOfTextAtSize(seminar.title, seminarSize);
  page.drawText(seminar.title, {
    x: (width - seminarW) / 2,
    y: cursorY - 10,
    size: seminarSize,
    font: timesBold,
    color: COLORS.text,
  });
  cursorY -= seminarSize + 20;

  // Carga horária + data
  const details = `${formatHours(totalSeconds)} de carga horária · ${lessons.length} aulas assistidas`;
  const dW = helvetica.widthOfTextAtSize(details, 11);
  page.drawText(details, { x: (width - dW) / 2, y: cursorY, size: 11, font: helvetica, color: COLORS.textLight });
  cursorY -= 30;

  // Box de dados
  const boxY = m + 130;
  const boxHeight = 80;
  const boxMargin = 40;
  page.drawRectangle({
    x: boxMargin,
    y: boxY,
    width: width - 2 * boxMargin,
    height: boxHeight,
    borderColor: COLORS.border,
    borderWidth: 0.5,
    color: COLORS.surface,
  });
  // 3 colunas
  const colW = (width - 2 * boxMargin) / 3;
  const colY1 = boxY + boxHeight - 22;
  const colY2 = boxY + boxHeight - 42;
  const colY3 = boxY + 16;
  // Emitido em
  page.drawText("EMITIDO EM", { x: boxMargin + 16, y: colY1, size: 8, font: helveticaBold, color: COLORS.textLight });
  page.drawText(formatDateBR(cert.issuedAt), { x: boxMargin + 16, y: colY2, size: 12, font: helvetica, color: COLORS.text });
  page.drawText("São Paulo, Brasil", { x: boxMargin + 16, y: colY3, size: 9, font: helveticaOblique, color: COLORS.textLight });
  // Término do seminário
  page.drawText("SEMINÁRIO ENCERRADO EM", { x: boxMargin + colW + 16, y: colY1, size: 8, font: helveticaBold, color: COLORS.textLight });
  page.drawText(formatDateBR(seminar.endDate), { x: boxMargin + colW + 16, y: colY2, size: 12, font: helvetica, color: COLORS.text });
  page.drawText(`Coordenação: ${(db.list("users") as User[]).find((u) => u.id === seminar.coordinatorId)?.fullName ?? "—"}`, { x: boxMargin + colW + 16, y: colY3, size: 9, font: helvetica, color: COLORS.textLight });
  // Participante ID
  page.drawText("PARTICIPANTE", { x: boxMargin + 2 * colW + 16, y: colY1, size: 8, font: helveticaBold, color: COLORS.textLight });
  page.drawText(user.email, { x: boxMargin + 2 * colW + 16, y: colY2, size: 11, font: helvetica, color: COLORS.text });
  page.drawText(`ID: ${user.id}`, { x: boxMargin + 2 * colW + 16, y: colY3, size: 9, font: helvetica, color: COLORS.textLight });

  // QR code
  const qrImg = await pdf.embedPng(qrDataUrl);
  const qrSize = 90;
  const qrX = m + 30;
  const qrY = m + 18;
  page.drawImage(qrImg, { x: qrX, y: qrY, width: qrSize, height: qrSize });
  page.drawText("Valide este certificado em:", { x: qrX + qrSize + 12, y: qrY + qrSize - 25, size: 8, font: helveticaBold, color: COLORS.textLight });
  page.drawText(validateUrl, { x: qrX + qrSize + 12, y: qrY + qrSize - 40, size: 8, font: helvetica, color: COLORS.primary });
  page.drawText(`Código: ${cert.validationCode}`, { x: qrX + qrSize + 12, y: qrY + qrSize - 55, size: 8, font: helvetica, color: COLORS.text });
  page.drawText("Escaneie o QR para validar a autenticidade.", { x: qrX + qrSize + 12, y: qrY + 15, size: 7, font: helveticaOblique, color: COLORS.textLight });

  // Assinatura
  const sigX = width - m - 220;
  const sigY = m + 50;
  page.drawLine({ start: { x: sigX, y: sigY + 30 }, end: { x: sigX + 180, y: sigY + 30 }, color: COLORS.text, thickness: 0.5 });
  page.drawText("Coordenação Geral", { x: sigX, y: sigY + 14, size: 9, font: helveticaBold, color: COLORS.text });
  page.drawText("Sociedade Psicanalítica Online", { x: sigX, y: sigY, size: 8, font: helvetica, color: COLORS.textLight });

  // Rodapé
  page.drawText(
    `Documento gerado em ${new Date().toLocaleString("pt-BR")} · spo-learning.com.br · ${cert.revoked ? "ESTE CERTIFICADO FOI REVOGADO" : "VÁLIDO"}`,
    { x: m + 20, y: m - 8, size: 7, font: helvetica, color: COLORS.textLight }
  );

  if (cert.revoked) {
    page.drawText("REVOGADO", {
      x: 100,
      y: height / 2,
      size: 90,
      font: timesBold,
      color: COLORS.accent,
      opacity: 0.18,
      rotate: degrees(20),
    });
  }

  const bytes = await pdf.save();
  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="certificado-${cert.validationCode}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
