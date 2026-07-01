import type { Metadata } from "next";
import * as React from "react";
import { UserSimulator } from "@/components/dev/user-simulator";
import { Providers } from "@/components/providers";
import { inter, playfairDisplay } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPO Learning — Sociedade Psicanalítica Online",
  description: "Plataforma de formação continuada da Sociedade Psicanalítica Online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body>
        <Providers>
          {children}
          <UserSimulator />
        </Providers>
      </body>
    </html>
  );
}
