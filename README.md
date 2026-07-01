# SPO Learning

Plataforma de formação continuada da **Sociedade Psicanalítica Online** — seminários, aulas em vídeo, acompanhamento de frequência e certificação automática.

Stack: **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4**.

**🌐 Produção:** https://spo-learning.sociedadepsicanaliticaonline.workers.dev

---

## Quick start (desenvolvimento local)

```bash
npm install
npm run dev
# http://localhost:3000
```

Para testar todos os papéis (Participante, Coordenador, Super Admin), abra `http://localhost:3000/login` e escolha um dos 6 usuários seed — ou use o **FAB "Simular usuário"** no canto inferior direito para alternar a qualquer momento.

### Usuários seed

| E-mail | Papel | Status |
|---|---|---|
| `admin@spo.test` | Super Admin | — |
| `ana.coord@spo.test` | Coordenador | ativo |
| `paulo.coord@spo.test` | Coordenador | **suspenso** |
| `alice@spo.test` | Participante | — |
| `bruno@spo.test` | Participante | — |
| `clara@spo.test` | Participante | — |

Senha: nenhuma. Na Fase 1, o login é apenas simulação (troca o usuário ativo na sessão).

---

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Dev server (Next.js padrão) |
| `npm run build` | Build de produção local (Node) |
| `npm run start` | Inicia o build de produção local |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build:assets` | Regenera `src/lib/embedded-assets.ts` (logos em base64) |
| `npm run build:cf` | Build OpenNext para Cloudflare Workers |
| `npm run preview:cf` | Preview local do Worker (Wrangler dev) |
| `npm run deploy:cf` | Build + deploy para Cloudflare |

---

## Arquitetura

```
src/
├── app/                      # App Router (rotas e layouts)
│   ├── (app)/                # Área logada — participante
│   ├── admin/                # Painel — coordenador + super admin
│   ├── api/certificates/     # Geração de PDF server-side
│   └── ...
├── components/
│   ├── ui/                   # Primitivos (Button, Card, Logo, DataTable...)
│   ├── forms/                # Formulários (RHF + zod)
│   ├── layout/               # SiteHeader, SiteFooter, AdminSidebar
│   ├── player/               # YouTube IFrame Player
│   └── dev/                  # User simulator (FAB)
├── services/                 # Camada de dados plugável
│   ├── types.ts              # Interfaces (contratos)
│   ├── mock-implementation.ts
│   └── provider.tsx          # Context (injetável)
├── data/
│   ├── seed.ts               # Dados iniciais
│   └── store.ts              # Wrapper localStorage (cliente)
├── hooks/                    # React Query + auth
├── lib/                      # utils, fonts, zod schemas
├── types/                    # TypeScript types (espelha schema)
└── assets/                   # Logo-01 (claro) e logo-02 (escuro)
```

A camada de **serviços** é a única que precisa mudar quando o backend real (Supabase) entrar — basta criar um `SupabaseRepository` que implemente as mesmas interfaces e injetar via `ServicesProvider`.

---

## Deploy no Cloudflare

O projeto usa **OpenNext for Cloudflare** para compilar Next.js em Workers.

### Pré-requisitos

- Conta Cloudflare com `wrangler` autenticado
- Node.js 20+

```bash
npx wrangler login
```

### Build + Deploy

```bash
npm run build:cf         # gera o bundle em .open-next/
npm run deploy:cf        # publica via Wrangler
```

O comando `build:cf` automaticamente roda `build:assets` antes (via `prebuild:cf`) para regenerar as logos em base64.

### Preview local (Worker)

```bash
npm run preview:cf       # simula o Worker localmente
```

### Configuração

- `wrangler.jsonc` — configuração do Worker (entrypoint, compat flags, bindings)
- `open-next.config.ts` — ajustes do OpenNext (R2 cache, etc.)

A flag **`nodejs_compat`** é obrigatória (o runtime `nodejs` da rota de PDF depende dela).

### Custom domain

Após o primeiro deploy, configure o domínio customizado no painel do Cloudflare (Workers → spo-learning → Settings → Triggers → Custom Domains).

### Primeiro deploy

```bash
# 1. Instalar dependências
npm install

# 2. Autenticar no Cloudflare (uma vez por máquina)
npx wrangler login
# OU use um API token via env var:
export CLOUDFLARE_API_TOKEN=seu_token
export CLOUDFLARE_ACCOUNT_ID=seu_account_id

# 3. Deploy
npm run deploy:cf
```

O script `deploy:cf` executa automaticamente `prebuild:cf` que regenera as logos em base64, depois roda `opennextjs-cloudflare deploy` que compila o bundle em `.open-next/` e publica no Cloudflare Workers.

> ⚠️ **Nunca** commite credenciais no repositório. O `.gitignore` já ignora `.dev.vars` e `.wrangler/`.

---

## Design system

Segue rigorosamente o `design-system.md` na raiz do repositório. As decisões de tipografia, paleta, espaçamentos, raio e sombras foram implementadas em `src/app/globals.css` via `@theme inline` (Tailwind v4) e tokens de `@utility`.

**Cores institucionais**

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#2E539D` | 60% dos elementos coloridos |
| `primary-light` | `#4F5FA3` | 25% |
| `primary-dark` | `#202646` | 10% (fundos escuros) |
| `accent` | `#7A2D2E` | 5% (CTAs estratégicos — moderação!) |

**Tipografia:** Playfair Display (títulos) + Inter (corpo/UI).

---

## Spec original

A especificação completa do produto está em [`SPEC-02-SPO-Learning-v2.md`](./SPEC-02-SPO-Learning-v2.md) na raiz do repositório.
