# Design System — Sociedade Psicanalítica Online (SPO)

> **Identidade visual completa** para uso em qualquer projeto baseado no SPO. Este documento contém todas as informações necessárias (cores, tipografia, tokens, componentes, snippets de CSS/Tailwind) para reproduzir fielmente a identidade do site institucional.

**Site de referência:** https://spo-site.sociedadepsicanaliticaonline.workers.dev
**Stack do site original:** Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
**Logos disponíveis:** `src/assets/logo-01.png` (claro) e `src/assets/logo-02.png` (escuro)

---

## Índice

1. [Conceito e Identidade](#1-conceito-e-identidade)
2. [Paleta de Cores](#2-paleta-de-cores)
3. [Tipografia](#3-tipografia)
4. [Tokens de Design](#4-tokens-de-design)
5. [Componentes Base (UI Primitives)](#5-componentes-base-ui-primitives)
6. [Componentes de Formulário](#6-componentes-de-formulário)
7. [Componentes de Layout](#7-componentes-de-layout)
8. [Componentes do Painel Admin](#8-componentes-do-painel-admin)
9. [Configuração Tailwind CSS](#9-configuração-tailwind-css)
10. [Variáveis CSS Globais](#10-variáveis-css-globais)
11. [Configuração de Fontes](#11-configuração-de-fontes)
12. [Snippets Prontos](#12-snippets-prontos)
13. [Diretrizes de Uso](#13-diretrizes-de-uso)

---

## 1. Conceito e Identidade

A identidade visual da Sociedade Psicanalítica Online foi desenvolvida para transmitir **seriedade, acolhimento, estabilidade e excelência** na formação psicanalítica.

- **Personalidade da marca:** intelectual, confiável, serena, moderna e contemporânea
- **Pilares visuais:** tons de azul que representam **conhecimento, confiança e profundidade**, complementados pelo **vermelho institucional** presente na logomarca, utilizado como cor de destaque estratégica
- **Estilo:** corporativo-moderno com viés editorial minimalista — tipografia serifada em títulos (Playfair Display) + sans-serif em corpo (Inter)
- **Atmosfera:** ambiente de consultório de alto padrão / biblioteca universitária — profissional, sóbrio, profundamente intencional

### Princípios visuais
- Elegância e sobriedade
- Clareza na organização das informações
- Forte contraste para leitura confortável
- Uso predominante de espaços em branco
- Hierarquia visual consistente
- Interface limpa e contemporânea
- Destaques discretos e intencionais
- Consistência entre site institucional e plataforma de ensino

---

## 2. Paleta de Cores

### 2.1 Cores Institucionais (primárias)

| Cor                | Hex       | RGB              | Função                                                       |
| ------------------ | --------- | ---------------- | ------------------------------------------------------------ |
| **Azul Institucional** (Primary) | `#2E539D` | `46, 83, 157`    | Cor principal — botões primários, links, ícones, cabeçalhos, cards ativos, destaques institucionais, elementos de navegação. Usar em ~60% dos elementos coloridos |
| **Azul Claro** (Primary Light)    | `#4F5FA3` | `79, 95, 163`    | Apoio, hover de botões, cards destacados, badges, tags, ícones secundários, estados ativos, barras de progresso. Usar em ~25% |
| **Azul Profundo** (Primary Dark)  | `#202646` | `32, 38, 70`     | Fundos escuros, header, footer, hero banner, sidebar administrativa, áreas institucionais. Usar em ~10% |
| **Vermelho SPO** (Accent)         | `#7A2D2E` | `122, 45, 46`    | CTAs estratégicos, botões "Matricule-se", avisos importantes, indicadores de eventos, ícones de destaque, elementos da logomarca. **Usar com moderação** (~5%) para preservar seu impacto |

### 2.2 Paleta Neutra

| Cor               | Hex       | RGB              | Uso                                          |
| ----------------- | --------- | ---------------- | -------------------------------------------- |
| **Branco**         | `#FFFFFF` | `255, 255, 255`  | Fundo principal                              |
| **Cinza Muito Claro** (Surface) | `#F5F7FA` | `245, 247, 250`  | Fundos de seções alternadas, fundo de cards secundários, áreas de destaque suaves |
| **Cinza Claro** (Border) | `#E6EAF0` | `230, 234, 240`  | Bordas, divisores, separadores                |
| **Cinza Médio** (Text Light) | `#7A8594` | `124, 133, 148`  | Textos auxiliares, legendas, descrições secundárias |
| **Cinza Escuro** (Text) | `#2F3640` | `47, 54, 64`     | Texto principal, parágrafos                   |

### 2.3 Hierarquia de uso (proporção recomendada)

```
Primary (azul)       → ~60%  (uso principal)
Primary Light        → ~25%  (apoio)
Primary Dark         → ~10%  (fundos escuros)
Accent (vermelho)    → ~5%   (destaque — moderação!)
Neutros (branco/cinza) → base para o restante
```

### 2.4 Cores de Feedback (alertas)

```
Informação: #2E539D (Azul Institucional)
Sucesso:    #16A34A (verde)
Aviso:      #EAB308 (amarelo)
Erro:       #7A2D2E (Vermelho SPO)
```

### 2.5 Resumo em CSS Variables

```css
:root {
  /* Cores Institucionais */
  --color-primary:        #2e539d;
  --color-primary-light:  #4f5fa3;
  --color-primary-dark:   #202646;

  /* Cor de Destaque */
  --color-accent:         #7a2d2e;

  /* Cores Neutras */
  --color-background:     #ffffff;
  --color-surface:        #f5f7fa;
  --color-border:         #e6eaf0;
  --color-text:           #2f3640;
  --color-text-light:     #7a8594;
  --color-white:          #ffffff;
}
```

### 2.6 Tailwind v4 Theme (configuração real do projeto)

```css
@theme inline {
  --color-primary:        #2e539d;
  --color-primary-light:  #4f5fa3;
  --color-primary-dark:   #202646;
  --color-accent:         #7a2d2e;
  --color-background:     #ffffff;
  --color-surface:        #f5f7fa;
  --color-border:         #e6eaf0;
  --color-text:           #2f3640;
  --color-text-light:     #7a8594;
  --color-white:          #ffffff;
}
```

Uso: `bg-primary`, `text-primary`, `border-primary`, `bg-primary/10`, `hover:bg-primary-light`, etc.

---

## 3. Tipografia

### 3.1 Fontes

A tipografia utiliza um **par serifada + sans-serif** clássico editorial:

| Família            | Uso                                                      | Pesos        | Variável CSS           |
| ------------------ | -------------------------------------------------------- | ------------ | ---------------------- |
| **Playfair Display** | Títulos, hero, headlines (h1, h2, h3), logo textual       | 400, 600, 700 | `--font-heading`       |
| **Inter**            | Corpo, parágrafos, UI, navegação, botões, formulários     | 300, 400, 500, 600, 700 | `--font-body` |

Importação (Google Fonts):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap" rel="stylesheet">
```

### 3.2 Escala Tipográfica (utility classes)

Definidas em `globals.css` como `@utility` (Tailwind v4):

```css
@utility heading-xl {
  font-family: var(--font-heading);
  font-size: 2.5rem;       /* 40px */
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.02em;
}

@utility heading-lg {
  font-family: var(--font-heading);
  font-size: 2rem;         /* 32px */
  line-height: 1.25;
  font-weight: 600;
}

@utility heading-md {
  font-family: var(--font-heading);
  font-size: 1.5rem;       /* 24px */
  line-height: 1.3;
  font-weight: 600;
}

@utility heading-sm {
  font-family: var(--font-heading);
  font-size: 1.25rem;      /* 20px */
  line-height: 1.35;
  font-weight: 600;
}

@utility body-lg {
  font-family: var(--font-body);
  font-size: 1rem;         /* 16px */
  line-height: 1.75;
  font-weight: 400;
}

@utility body-md {
  font-family: var(--font-body);
  font-size: 0.875rem;      /* 14px */
  line-height: 1.6;
  font-weight: 400;
}

@utility body-sm {
  font-family: var(--font-body);
  font-size: 0.75rem;       /* 12px */
  line-height: 1.5;
  font-weight: 400;
}

@utility caption {
  font-family: var(--font-body);
  font-size: 0.75rem;       /* 12px */
  line-height: 1.25;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### 3.3 Hierarquia de uso

| Contexto         | Utility            | Tamanho  | Peso |
| ---------------- | ------------------ | -------- | ---- |
| Hero principal    | `heading-xl`       | 40px     | 700  |
| Título de seção  | `heading-lg`       | 32px     | 600  |
| Título de card   | `heading-md`       | 24px     | 600  |
| Subtítulo / h4   | `heading-sm`       | 20px     | 600  |
| Parágrafo        | `body-lg`          | 16px     | 400  |
| Texto secundário | `body-md`          | 14px     | 400  |
| Caption / meta   | `body-sm` ou `caption` | 12px  | 500  |

### 3.4 Configuração next/font (projeto original)

```ts
// src/lib/fonts.ts
import { Playfair_Display, Inter } from "next/font/google"

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
})

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})
```

Aplicação no `app/layout.tsx`:
```tsx
<html lang="pt-BR" className={`${playfairDisplay.variable} ${inter.variable}`}>
```

### 3.5 Cores de texto

- **Título principal:** `text-text` (`#2F3640`)
- **Subtítulo:** `text-primary` (`#2E539D`)
- **Corpo:** `text-text-light` (`#7A8594`) ou `text-text`
- **Link:** `text-primary` com hover `text-primary-light`
- **Texto em fundo escuro:** `text-white` com `text-white/70` para secundário

---

## 4. Tokens de Design

### 4.1 Espaçamentos

Base em **8px**. Container principal com largura máxima de **75rem (1200px)**.

| Token                 | Valor     | Uso                              |
| --------------------- | --------- | -------------------------------- |
| `--spacing-gutter`     | `1.5rem`  | Padding/gaps internos (24px)     |
| `--spacing-container-max` | `75rem` | Largura máxima do container (1200px) |
| `--spacing-margin-desktop` | `4rem`  | Margem lateral em desktop (64px) |
| `--spacing-margin-mobile`  | `1rem`  | Margem lateral em mobile (16px)  |

**Seções verticais:** `py-16 md:py-24` (64px / 96px)
**Cards internos:** `p-6` (24px) ou `p-8` (32px)

### 4.2 Raios de Borda (Border Radius)

```css
--radius-sm:   0.25rem;  /* 4px  */
--radius-md:   0.375rem; /* 6px  */
--radius-lg:   0.5rem;   /* 8px  */
--radius-xl:   0.75rem;  /* 12px */
--radius-2xl:  1rem;     /* 16px */
```

**Uso no projeto:**
- Cards: `rounded-xl` (12px) ou `rounded-2xl` (16px)
- Botões: `rounded-lg` (8px)
- Badges: `rounded-full`
- Inputs: `rounded-lg` (8px)
- Modais: `rounded-xl` (12px)
- Imagens: `rounded-lg` ou `rounded-2xl`

### 4.3 Sombras

Padrão discreto, hierarquia tonal (preferência por bordas + camadas):

| Token              | Valor                                          | Uso                |
| ------------------ | ---------------------------------------------- | ------------------ |
| Sutil (padrão)     | `0 1px 2px rgba(0,0,0,0.04)`                  | Cards em repouso   |
| Card hover         | `0 10px 25px -5px rgba(0,0,0,0.1)`            | Hover de cards     |
| Modal              | `0 20px 25px -5px rgba(0,0,0,0.1)`            | Modais             |
| Header sticky      | `0 1px 3px rgba(0,0,0,0.05)`                  | Header com scroll  |

**Preferência:** usar **bordas (`border`)** em vez de sombras pesadas. Sombras apenas em hover e modais.

```css
.shadow-sm  → 0 1px 2px rgba(0,0,0,0.04)
.shadow-md  → 0 4px 6px -1px rgba(0,0,0,0.05)
.shadow-lg  → 0 10px 25px -5px rgba(0,0,0,0.1)
```

### 4.4 Animações

```css
--animate-fade-in:      fade-in 0.6s ease-out;
--animate-fade-up:      fade-up 0.6s ease-out;
--animate-slide-in:     slide-in 0.3s ease-out;
--animate-scale-in:     scale-in 0.2s ease-out;
--animate-accordion-down: accordion-down 0.2s ease-out;
--animate-accordion-up:   accordion-up 0.2s ease-out;

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in {
  from { opacity: 0; transform: translateX(-0.5rem); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

---

## 5. Componentes Base (UI Primitives)

Todos os componentes abaixo estão em `src/components/ui/` no projeto original.

### 5.1 Button

Variantes e tamanhos (via `class-variance-authority`):

```ts
variants: {
  variant: {
    default:  "bg-primary text-white hover:bg-primary-light shadow-sm active:shadow-none",
    secondary: "bg-surface text-primary hover:bg-border border border-border",
    outline:  "border-2 border-primary text-primary bg-white hover:bg-primary/5",
    ghost:    "text-text hover:text-primary hover:bg-surface",
    link:     "text-primary underline-offset-4 hover:underline p-0 h-auto",
    accent:   "bg-accent text-white hover:brightness-90 shadow-sm active:shadow-none",
    danger:   "bg-accent text-white hover:brightness-90 shadow-sm",
  },
  size: {
    default:   "h-11 px-6 py-2.5 text-body-md",
    sm:        "h-9 px-4 py-2 text-body-sm",
    lg:        "h-13 px-8 py-3 text-body-lg",
    xl:        "h-14 px-10 py-4 text-body-lg",
    icon:      "h-11 w-11",
    "icon-sm":  "h-9 w-9",
  },
}

defaultVariants: { variant: "default", size: "default" }
```

Base: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-body font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`

**Exemplos de uso:**
- Primário: `<Button>Inscreva-se</Button>`
- Accent (Matricule-se): `<Button variant="accent">Matricule-se</Button>`
- Outline: `<Button variant="outline">Saiba mais</Button>`
- Ghost: `<Button variant="ghost">Cancelar</Button>`
- Danger: `<Button variant="danger">Excluir</Button>`

### 5.2 Card

```css
default:  "rounded-xl border border-border bg-white shadow-sm"
surface:  "rounded-xl border border-border bg-surface shadow-sm"
highlight: "rounded-xl border-2 border-primary bg-white shadow-sm"
primary-dark: "rounded-xl border border-primary-dark/20 bg-primary-dark text-white"
```

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>Conteúdo</CardContent>
  <CardFooter>Rodapé</CardFooter>
</Card>
```

### 5.3 Input

```css
"flex h-11 w-full rounded-lg border border-border bg-white px-4 py-2.5 body-md text-text placeholder:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
```

Estado de erro: `border-accent focus-visible:ring-accent`

### 5.4 Textarea

```css
"flex min-h-[80px] w-full rounded-lg border border-border bg-white px-4 py-2.5 body-md text-text placeholder:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
```

### 5.5 Badge

```ts
variants: {
  default:  "border-transparent bg-primary text-white"
  secondary: "border-transparent bg-surface text-primary"
  accent:   "border-transparent bg-accent text-white"
  outline:  "border-border text-text-light"
}
base: "inline-flex items-center rounded-full border px-2.5 py-0.5 caption font-body"
```

### 5.6 Modal (Radix Dialog wrapper)

```
max-w-lg w-full p-6 rounded-xl bg-white shadow-lg
```
- Overlay: `fixed inset-0 z-50 bg-black/50`
- Animações: `data-[state=open]:animate-scale-in`

### 5.7 EmptyState

```tsx
<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
  <div className="mb-4 text-text-light">{icon || <Inbox className="h-12 w-12" />}</div>
  <h3 className="heading-md text-text mb-2">{title}</h3>
  {description && <p className="body-md text-text-light max-w-sm mb-6">{description}</p>}
  {action}
</div>
```

### 5.8 Spinner

```
"animate-spin rounded-full border-2 border-border border-t-primary"
```
Tamanhos: `h-4 w-4` (sm), `h-6 w-6` (md), `h-8 w-8` (lg)

### 5.9 Skeleton

```
"animate-pulse rounded-lg bg-border"
```

### 5.10 Avatar

```tsx
<Avatar>
  <AvatarImage src={url} alt={name} />
  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
</Avatar>
```
- Image: `aspect-square h-full w-full object-cover`
- Fallback: `flex h-full w-full items-center justify-center rounded-full bg-muted`

### 5.11 Separator

```
shrink-0 bg-border h-[1px] w-full        (horizontal)
shrink-0 bg-border h-full w-[1px]       (vertical)
```

### 5.12 Tag (componente de tag/badge customizado)

Similar ao Badge com padding maior, usado para categorias em cards.

### 5.13 Pagination, Tooltip, Tabs, Drawer, Accordion, Checkbox, RadioGroup, Select

Todos baseados em Radix UI primitives com a mesma linguagem visual:
- `rounded-lg` para controles
- `border-border` padrão
- `focus-visible:ring-2 focus-visible:ring-primary`
- `bg-surface` em hover
- Animações definidas nas keyframes acima

---

## 6. Componentes de Formulário

Em `src/components/forms/`. Cada wrapper adiciona label, estado de erro e acessibilidade.

### 6.1 FormInput

```tsx
<FormInput
  label="Nome"
  placeholder="Digite..."
  error={errors.name}
  {...register("name")}
/>
```

### 6.2 FormTextarea

```tsx
<FormTextarea
  label="Descrição"
  rows={6}
  error={errors.description}
  {...register("description")}
/>
```

### 6.3 FormSelect (via Controller)

```tsx
<Controller
  name="category"
  control={control}
  render={({ field }) => (
    <FormSelect
      label="Categoria"
      value={field.value}
      onValueChange={field.onChange}
      options={[{ value: "1", label: "Opção 1" }]}
      error={errors.category}
    />
  )}
/>
```

### 6.4 FormCheckbox

```tsx
<FormCheckbox
  label="Destacar na home"
  checked={field.value}
  onCheckedChange={field.onChange}
/>
```

### 6.5 FormSwitch

```tsx
<FormSwitch
  label="Vagas abertas"
  checked={field.value}
  onCheckedChange={field.onChange}
/>
```

### 6.6 FormRadioGroup

```tsx
<FormRadioGroup
  label="Tipo"
  value={field.value}
  onValueChange={field.onChange}
  options={[
    { value: "online", label: "Online" },
    { value: "presencial", label: "Presencial" },
  ]}
/>
```

**Padrão de erro:** `<p className="body-sm text-accent" role="alert">{error.message}</p>`

---

## 7. Componentes de Layout

### 7.1 Container

```tsx
<Container className="py-16 md:py-24">
  {children}
</Container>
```

Aplica: `width: 100%`, `max-width: 75rem (1200px)`, `margin: auto`, padding lateral `1rem` (mobile) / `4rem` (desktop).

### 7.2 Header (sticky)

```tsx
<header className={cn(
  "sticky top-0 z-50 w-full transition-all duration-300",
  scrolled
    ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
    : "bg-white border-b border-transparent"
)}>
  <Container className="flex items-center justify-between gap-4 lg:gap-6 h-16 md:h-20">
    <div className="flex items-center gap-4 lg:gap-6 min-w-0">
      <Logo />
      <DesktopNav className="hidden lg:flex" />
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <SearchBar />
      <Link className="hidden xl:inline-flex ... bg-primary text-white">Portal do Aluno</Link>
      <MobileNav />
    </div>
  </Container>
</header>
```

### 7.3 Footer

Estrutura em grid 12 colunas em `bg-primary-dark text-white`:
- Col 1-4: Logo + descrição + redes sociais + email/telefone
- Col 5-6: Navegação
- Col 7-8: Institucional
- Col 9-10: Suporte
- Linha inferior: copyright + termos/privacidade

```css
bg-primary-dark text-white
border-white/10  (separadores)
text-white/60 hover:text-primary-light
```

### 7.4 Sections (componentes de seção reutilizáveis)

Em `src/components/sections/`. Cada um é um wrapper de layout com props específicas:

- **HeroSection** — variantes: `home`, `internal`, `event`, `course`
- **AboutSection** — 3 features + título/descrição, props `light`, `reverse`
- **FeaturesSection** — grid N colunas, props `columns` (2, 3, 4)
- **CoursesSection**, **EventsSection**, **BlogSection**, **TestimonialsSection** — listas com cards
- **CTASection** — variantes: `vertical`, `horizontal`, `banner`
- **CalloutSection** — citação com autor
- **StatsSection** — números grandes
- **FAQSection** — accordion

Padrão de fundo: alternar `bg-white` e `bg-surface` entre seções.

---

## 8. Componentes do Painel Admin

Em `src/components/admin/`.

### 8.1 PageHeader

```tsx
<PageHeader
  title="Blog"
  description="Gerencie os artigos..."
  backHref="/admin"
  action={{ label: "Novo", href: "/admin/blog/novo", icon: <Plus /> }}
/>
```

Estrutura: título + descrição à esquerda, botão de ação à direita. Opcional `backHref` mostra link "Voltar".

### 8.2 AdminFormLayout

```tsx
<AdminFormLayout sidebar={<Card>...</Card>}>
  <Card>...</Card>
  <Card>...</Card>
</AdminFormLayout>
```

Grid 2 colunas: 2/3 conteúdo + 1/3 sidebar (sticky `top-24`).

### 8.3 DataTable

```tsx
<DataTable<T>
  columns={[
    { key: "name", header: "Nome", cell: (item) => <span>{item.name}</span> },
  ]}
  items={items}
  keyExtractor={(item) => item.id}
  actions={(item) => <Button>...</Button>}
  emptyTitle="Nenhum item"
  emptyAction={<Button>Criar</Button>}
/>
```

Tabela com cabeçalho `bg-surface`, hover `bg-surface/50`, coluna de ações à direita. EmptyState quando vazia.

### 8.4 SearchFilter

```tsx
<SearchFilter value={search} onChange={setSearch} placeholder="Buscar..." />
```

Input com ícone de lupa, `max-w-md`.

### 8.5 ConfirmDeleteModal

```tsx
<ConfirmDeleteModal
  open={open}
  onOpenChange={setOpen}
  title="Excluir item"
  description="Tem certeza?"
  onConfirm={handleDelete}
  isLoading={loading}
/>
```

Modal com ícone de alerta vermelho, dois botões: "Cancelar" (outline) e "Excluir" (danger).

### 8.6 TagInput

```tsx
<TagInput
  label="Tags"
  values={["Lacan", "Freud"]}
  onChange={(values) => field.onChange(values.map(createTag))}
  placeholder="Adicionar..."
/>
```

Input que transforma strings em array. Pressione Enter ou vírgula para adicionar. Backspace remove o último.

### 8.7 ImagePreview / MediaUploader

```tsx
<ImagePreview
  value={url}
  onChange={setUrl}
  label="Imagem"
  placeholder="/images/example.jpg"
/>
```

Preview à esquerda (16:9 ou quadrado), input URL à direita.

```tsx
<MediaUploader
  value={url}
  onChange={setUrl}
  accept="image"  // ou "pdf" ou "all"
  label="Imagem"
/>
```

Adiciona botões "Enviar arquivo" (upload) e "Escolher da biblioteca" (MediaPicker).

### 8.8 StatusBadge

```tsx
<StatusBadge active={item.available} activeLabel="Aberto" inactiveLabel="Fechado" />
```

### 8.9 RichTextEditor (editor de conteúdo rico)

Componente para edição de conteúdo HTML (usado no blog). Inclui:
- Toolbar com: Bold, Italic, Underline, Strikethrough, H2, H3, P, Listas, Citação, Código, Link, Imagem (via MediaPicker), Vídeo (YouTube/Vimeo), Desfazer/Refazer
- contentEditable
- Sanitização de HTML (defesa XSS)
- Inserção de iframes apenas para YouTube/Vimeo

---

## 9. Configuração Tailwind CSS

### 9.1 globals.css (Tailwind v4)

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-primary:        #2e539d;
  --color-primary-light:  #4f5fa3;
  --color-primary-dark:   #202646;
  --color-accent:         #7a2d2e;
  --color-background:     #ffffff;
  --color-surface:        #f5f7fa;
  --color-border:         #e6eaf0;
  --color-text:           #2f3640;
  --color-text-light:     #7a8594;
  --color-white:          #ffffff;

  --font-heading: "Playfair Display", serif;
  --font-body:    "Inter", sans-serif;

  --radius-sm:   0.25rem;
  --radius-md:   0.375rem;
  --radius-lg:   0.5rem;
  --radius-xl:   0.75rem;
  --radius-2xl:  1rem;

  --spacing-gutter:          1.5rem;
  --spacing-container-max:   75rem;
  --spacing-margin-desktop:  4rem;
  --spacing-margin-mobile:   1rem;

  --animate-fade-in:           fade-in 0.6s ease-out;
  --animate-fade-up:           fade-up 0.6s ease-out;
  --animate-slide-in:          slide-in 0.3s ease-out;
  --animate-scale-in:          scale-in 0.2s ease-out;
  --animate-accordion-down:    accordion-down 0.2s ease-out;
  --animate-accordion-up:      accordion-up 0.2s ease-out;

  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(1rem); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-0.5rem); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes accordion-down {
    from { height: 0; }
    to   { height: var(--radix-accordion-content-height); }
  }
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); }
    to   { height: 0; }
  }
}

@utility heading-xl { /* ... ver seção 3.2 ... */ }
@utility heading-lg { /* ... */ }
@utility heading-md { /* ... */ }
@utility body-lg    { /* ... */ }
@utility body-md    { /* ... */ }
@utility body-sm    { /* ... */ }
@utility caption    { /* ... */ }

@utility container-site {
  width: 100%;
  max-width: var(--spacing-container-max);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-margin-mobile);
  padding-right: var(--spacing-margin-mobile);
  @media (width >= 48rem) {
    padding-left: var(--spacing-margin-desktop);
    padding-right: var(--spacing-margin-desktop);
  }
}

body {
  font-family: var(--font-body);
  background-color: var(--color-background);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* { border-color: var(--color-border); }

::selection {
  background-color: var(--color-primary);
  color: var(--color-white);
}

/* Estilos para conteúdo rico (HTML do blog) */
.rich-content h2 { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 600; color: var(--color-text); margin-top: 2.5rem; margin-bottom: 1rem; }
.rich-content h3 { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 600; color: var(--color-text); margin-top: 2rem; margin-bottom: 0.75rem; }
.rich-content h4 { font-family: var(--font-heading); font-size: 1.125rem; font-weight: 600; color: var(--color-text); margin-top: 1.5rem; margin-bottom: 0.5rem; }
.rich-content p { color: var(--color-text-light); margin-bottom: 1rem; line-height: 1.75; }
.rich-content a { color: var(--color-primary); text-decoration: underline; text-underline-offset: 2px; }
.rich-content a:hover { color: var(--color-primary-light); }
.rich-content ul, .rich-content ol { margin: 1rem 0; padding-left: 1.5rem; color: var(--color-text-light); }
.rich-content ul { list-style: disc; }
.rich-content ol { list-style: decimal; }
.rich-content li { margin-bottom: 0.5rem; }
.rich-content blockquote { border-left: 4px solid var(--color-primary); padding-left: 1rem; font-style: italic; color: var(--color-text-light); margin: 1.5rem 0; }
.rich-content code { background-color: var(--color-surface); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875em; color: var(--color-accent); }
.rich-content pre { background-color: var(--color-surface); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1.5rem 0; }
.rich-content img { border-radius: 0.5rem; max-width: 100%; height: auto; margin: 1.5rem 0; }
.rich-content figure { margin: 1.5rem 0; }
.rich-content figcaption { font-size: 0.875rem; color: var(--color-text-light); text-align: center; margin-top: 0.5rem; }
.rich-content iframe { width: 100%; aspect-ratio: 16 / 9; border-radius: 0.5rem; border: 0; margin: 1.5rem 0; }
.rich-content hr { border: 0; border-top: 1px solid var(--color-border); margin: 2rem 0; }
.rich-content strong { color: var(--color-text); font-weight: 600; }
.rich-content u { text-decoration: underline; }
```

### 9.2 tailwind.config.js (equivalente para v3)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary:        "#2e539d",
        "primary-light":"#4f5fa3",
        "primary-dark": "#202646",
        accent:         "#7a2d2e",
        background:     "#ffffff",
        surface:        "#f5f7fa",
        border:         "#e6eaf0",
        text:           "#2f3640",
        "text-light":   "#7a8594",
        white:          "#ffffff",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body:    ["Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      maxWidth: {
        "container-max": "75rem",
      },
    },
  },
}
```

---

## 10. Variáveis CSS Globais

Já definidas na seção 9.1. Resumo final:

```css
:root {
  /* Cores */
  --color-primary:        #2e539d;
  --color-primary-light:  #4f5fa3;
  --color-primary-dark:   #202646;
  --color-accent:         #7a2d2e;
  --color-background:     #ffffff;
  --color-surface:        #f5f7fa;
  --color-border:         #e6eaf0;
  --color-text:           #2f3640;
  --color-text-light:     #7a8594;
  --color-white:          #ffffff;

  /* Fontes */
  --font-heading: "Playfair Display", serif;
  --font-body:    "Inter", sans-serif;

  /* Raios */
  --radius-sm:   0.25rem;
  --radius-md:   0.375rem;
  --radius-lg:   0.5rem;
  --radius-xl:   0.75rem;
  --radius-2xl:  1rem;

  /* Espaçamentos */
  --spacing-gutter:          1.5rem;
  --spacing-container-max:   75rem;
  --spacing-margin-desktop:  4rem;
  --spacing-margin-mobile:   1rem;
}
```

---

## 11. Configuração de Fontes

```bash
npm install next
# next/font usa Google Fonts automaticamente
```

```ts
// src/lib/fonts.ts
import { Playfair_Display, Inter } from "next/font/google"

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
})

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})
```

```tsx
// app/layout.tsx
import { playfairDisplay, inter } from "@/lib/fonts"

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

## 12. Snippets Prontos

### 12.1 Botão primário

```tsx
<button className="inline-flex items-center justify-center gap-2 h-11 px-6 py-2.5 rounded-lg bg-primary text-white body-md font-medium hover:bg-primary-light transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
  Inscreva-se
</button>
```

### 12.2 Botão accent (CTA forte)

```tsx
<button className="inline-flex items-center justify-center gap-2 h-11 px-6 py-2.5 rounded-lg bg-accent text-white body-md font-medium hover:brightness-90 transition-all">
  Matricule-se
</button>
```

### 12.3 Card padrão

```tsx
<div className="rounded-xl border border-border bg-white shadow-sm p-6">
  <h3 className="heading-md text-text mb-2">Título do Card</h3>
  <p className="body-md text-text-light">Conteúdo do card.</p>
</div>
```

### 12.4 Card de destaque (hover)

```tsx
<div className="rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary">
  Conteúdo
</div>
```

### 12.5 Badge secundário

```tsx
<span className="inline-flex items-center rounded-full border border-transparent bg-surface text-primary px-2.5 py-0.5 caption font-body">
  Vagas Abertas
</span>
```

### 12.6 Input

```tsx
<input
  type="text"
  className="flex h-11 w-full rounded-lg border border-border bg-white px-4 py-2.5 body-md text-text placeholder:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
  placeholder="Digite..."
/>
```

### 12.7 Hero interno (página)

```tsx
<section className="bg-primary-dark text-white py-24 md:py-32 relative overflow-hidden">
  <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary-dark via-primary-dark to-primary" />
  <Container className="relative z-10">
    <Badge variant="secondary" className="w-fit mb-4 border border-white/20 text-white/80">
      Desde 2014
    </Badge>
    <h1 className="heading-xl text-white mb-4">Título da Página</h1>
    <p className="body-lg text-white/70 max-w-2xl">Descrição da página.</p>
  </Container>
</section>
```

### 12.8 Seção com fundo alternado

```tsx
<section className="py-16 md:py-24 bg-surface">
  <Container>
    <h2 className="heading-lg text-text text-center mb-12">Título da Seção</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {items.map(item => <Card key={item.id}>{item.name}</Card>)}
    </div>
  </Container>
</section>
```

### 12.9 Link de navegação

```tsx
<Link
  href="/seminarios"
  className="inline-flex items-center gap-1 text-primary font-medium body-md hover:gap-2 transition-all"
>
  Saiba mais <ArrowRight className="h-4 w-4" />
</Link>
```

### 12.10 Logo no header

```tsx
<Image src={logo} alt="Logo" className="h-[60px] w-auto shrink-0" priority />
```

---

## 13. Diretrizes de Uso

### 13.1 O que FAZER

✅ Usar tons de azul como base da hierarquia visual
✅ Usar Playfair Display em títulos para dar sofisticação editorial
✅ Manter bastante espaço em branco entre seções
✅ Usar `bg-surface` (#F5F7FA) para alternar fundos de seções
✅ Usar `rounded-xl` (12px) ou `rounded-2xl` (16px) em cards
✅ Usar sombras sutis (ou apenas bordas) — evitar sombras pesadas
✅ Centralizar o conteúdo com `Container` (max-width 75rem)
✅ Usar `border-border` para separadores
✅ Usar accent (vermelho) APENAS para CTAs estratégicos (Matricule-se, Avisos)
✅ Manter contraste forte para acessibilidade
✅ Usar ícones Lucide com tamanho `h-5 w-5` ou `h-6 w-6`
✅ Adicionar `transition-all` em elementos interativos
✅ Usar `hover:bg-primary-light` em botões primários

### 13.2 O que NÃO FAZER

❌ Usar vermelho (accent) em mais de 5% dos elementos coloridos
❌ Usar sombras pesadas (exceto em modais)
❌ Usar texto branco sobre fundo claro
❌ Usar accent (vermelho) para links ou textos
❌ Misturar fontes (sempre Playfair + Inter)
❌ Usar `h-auto` em botões (manter tamanhos fixos)
❌ Usar fontes de ícones diferentes do Lucide
❌ Esquecer de adicionar `transition-colors` ou `transition-all` em hovers
❌ Usar `text-text-light` em textos importantes (deve ser `text-text`)
❌ Colocar muitos elementos na mesma linha horizontal sem respiro
❌ Usar `font-bold` em parágrafos (preferir `font-medium` ou peso herdado)
❌ Esquecer `shrink-0` na logo para evitar que ela comprima

### 13.3 Acessibilidade

- Sempre usar tags semânticas (`<nav>`, `<main>`, `<section>`, `<article>`)
- Contraste mínimo WCAG AA (4.5:1 para texto normal)
- Foco visível em todos os elementos interativos (`focus-visible:ring-2`)
- Labels em todos os campos de formulário
- `aria-label` em botões só com ícone
- `aria-current="page"` em links de navegação ativos
- `role="alert"` em mensagens de erro
- Suporte a navegação por teclado (Tab, Enter, Esc)

### 13.4 Performance

- Usar `next/image` com `width`/`height` ou `fill` para todas as imagens
- Lazy load abaixo da dobra (`loading="lazy"`)
- Usar `priority` apenas para imagens above-the-fold (logo, hero)
- Comprimir imagens antes do upload (ideal: WebP, < 200KB)
- Evitar fontes de ícones inline (preferir SVG/Lucide)
- Code splitting automático com Next.js

---

## Apêndice A — Dependências Recomendadas

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-checkbox": "^1.3.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-radio-group": "^1.4.0",
    "@radix-ui/react-select": "^2.3.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slot": "^1.3.0",
    "@radix-ui/react-switch": "^1.3.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@tanstack/react-query": "^5.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "framer-motion": "^12.0.0",
    "lucide-react": "^0.300.0",
    "react-hook-form": "^7.50.0",
    "@hookform/resolvers": "^3.9.0",
    "sonner": "^2.0.0",
    "tailwind-merge": "^2.5.0",
    "tailwindcss-animate": "^1.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

---

## Apêndice B — Estrutura de Pastas Recomendada

```
src/
├── app/
│   ├── (site)/                    # Rotas públicas
│   │   ├── page.tsx               # Home
│   │   ├── sobre/
│   │   ├── seminarios/
│   │   ├── eventos/
│   │   ├── blog/
│   │   └── ...
│   ├── (admin)/admin/             # Rotas administrativas
│   │   ├── layout.tsx             # Layout com sidebar
│   │   ├── page.tsx               # Dashboard
│   │   ├── blog/
│   │   └── ...
│   ├── api/
│   ├── layout.tsx                 # Root layout (fontes)
│   ├── globals.css                # CSS global + design system
│   └── sitemap.ts / robots.ts
├── components/
│   ├── ui/                        # Primitivos (Button, Card, Input...)
│   ├── forms/                     # FormInput, FormTextarea...
│   ├── layout/                    # Container, Header, Footer
│   ├── sections/                  # HeroSection, AboutSection...
│   ├── cards/                     # CourseCard, BlogCard...
│   ├── navigation/                # DesktopNav, MobileNav
│   ├── admin/                     # PageHeader, DataTable, etc.
│   └── shared/                    # Logo, Newsletter, SearchBar
├── lib/
│   ├── utils.ts                   # cn() helper
│   ├── fonts.ts                   # next/font config
│   ├── admin-store.ts             # localStorage helpers
│   ├── image-loader.ts            # custom image loader
│   └── schemas.ts                 # zod schemas
├── hooks/                         # useAdminBlog, useAdminCourses...
├── data/                          # Dados mockados (blog, events...)
├── types/                         # Interfaces TypeScript
├── config/                        # siteConfig
├── constants/                     # NAVIGATION_ITEMS, etc.
├── utils/                         # formatters, sanitize
└── assets/                        # logos, imagens
```

---

## Apêndice C — Resumo Rápido (para devs em hurry)

```css
/* Cores principais */
--primary: #2E539D;      /* 60% uso */
--primary-light: #4F5FA3; /* 25% */
--primary-dark: #202646;  /* 10% - fundos escuros */
--accent: #7A2D2E;        /* 5% - CTAs estratégicas */

/* Fontes */
font-heading: Playfair Display (títulos)
font-body: Inter (corpo e UI)

/* Container */
max-width: 1200px, margin auto, padding 1rem (mobile) / 4rem (desktop)

/* Botão padrão */
bg-primary text-white hover:bg-primary-light rounded-lg h-11 px-6

/* Card */
rounded-xl border border-border bg-white p-6

/* Seções */
py-16 md:py-24, alternar bg-white e bg-surface

/* Espaçamentos base: 8px */
```

---

**Última atualização:** Identidade visual alinhada com o site `spo-site.sociedadepsicanaliticaonline.workers.dev`

**Mantenedor:** Sociedade Psicanalítica Online
