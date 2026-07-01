"use client";

import { createContext, useContext, type ReactNode } from "react";
import { mockServices } from "./mock-implementation";
import type { Services } from "./types";

const ServicesContext = createContext<Services | null>(null);

export function ServicesProvider({ children }: { children: ReactNode }) {
  return <ServicesContext.Provider value={mockServices}>{children}</ServicesContext.Provider>;
}

export function useServices(): Services {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error("useServices deve ser usado dentro de <ServicesProvider>.");
  return ctx;
}
