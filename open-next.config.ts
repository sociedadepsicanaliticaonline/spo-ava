import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Enable R2 incremental static regeneration (opcional; sem bucket configurado
  // o OpenNext faz fallback para workaround em memória). Habilite quando
  // quiser cache de páginas estáticas que dependem de dados remotos.
  // incrementalCache: r2IncrementalCache({ binding: "NEXT_INC_CACHE_R2_BUCKET" }),
});
