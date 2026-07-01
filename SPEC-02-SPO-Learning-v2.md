# SPEC 02 — SPO Learning (v2)
### Plataforma de Ensino Continuado — Sociedade Psicanalítica

> Versão expandida a partir da spec original, com stack definida, schema de banco, regras de negócio e matriz de permissões — pronta para servir de input a modelos de geração de código.

---

## 0. Nomenclatura (ajuste em relação à v1)

| Termo v1 | Termo v2 | Motivo |
|---|---|---|
| Transmissões | **Aulas** | "Transmissão" é termo técnico da psicanálise; usar nesse sentido no produto geraria confusão para o público da Sociedade. |
| Seminarys | **Seminars** (tabela) / **Seminários** (produto) | Correção de grafia no plural em inglês. |

Doravante, a arquitetura de conteúdo é: **Seminário → Módulos → Aulas**.

---

## 1. Visão Geral

**Objetivo:** gerenciar a inscrição, participação, frequência e certificação de associados/participantes em seminários de formação continuada promovidos pela Sociedade Psicanalítica, com aulas em vídeo hospedadas no YouTube (via link) e assistidas dentro da plataforma.

**Diferencial de negócio:** o certificado de participação **não é emitido sob demanda** — ele é liberado automaticamente por um job após a data de término do seminário, condicionado à conclusão de 100% das aulas.

---

## 2. Stack Técnica (definição explícita)

| Camada | Tecnologia |
|---|---|
| Banco de dados / Backend as a Service | **Supabase self-hosted**, provisionado via **Coolify** em VPS própria |
| Autenticação | Supabase Auth (JWT), com Row Level Security (RLS) nativo do Postgres |
| Frontend | Next.js (React) — recomendado por integração nativa com Supabase e SSR para páginas públicas (ex.: validação de certificado) |
| Vídeo | **YouTube** (não-listado ou público), embed via **YouTube IFrame Player API** para rastreio de progresso real |
| Storage de arquivos | Supabase Storage (buckets) — usado para: miniaturas, PDFs de certificado, materiais complementares (PDF/DOCX/PPT) |
| Realtime | Supabase Realtime (ex.: status de frequência atualizando ao vivo no dashboard do coordenador) |
| Certificados | Geração de PDF server-side (ex.: `pdf-lib` ou `puppeteer` em edge function/worker) + QR Code apontando para rota pública de validação |
| Jobs agendados | Supabase Edge Functions + `pg_cron` (para liberação automática de certificados na data de término) |

> ⚠️ **Ponto de atenção operacional:** Supabase self-hosted via Coolify não tem os cron jobs gerenciados do Supabase Cloud "prontos out-of-the-box" — é necessário confirmar que a stack self-hosted inclui `pg_cron` habilitado no Postgres, ou implementar o agendamento via um worker externo (ex.: cron do próprio VPS chamando uma Edge Function/rota interna).

---

## 3. Papéis e Permissões (RBAC)

### 3.1 Papéis

1. **Participante** — associado/inscrito que assiste aulas.
2. **Coordenador** — responsável por um ou mais seminários.
3. **Super Admin** — gestão global da plataforma.

### 3.2 Matriz de Permissões

| Ação | Participante | Coordenador | Super Admin |
|---|:---:|:---:|:---:|
| Visualizar catálogo de seminários | ✅ | ✅ | ✅ |
| Inscrever-se em seminário | ✅ (próprio) | — | — |
| Assistir aulas / registrar progresso | ✅ (próprio) | ✅ (visualização) | ✅ |
| Criar/editar seminário | ❌ | ✅ (próprios) | ✅ (todos) |
| Criar módulos e aulas dentro de um seminário | ❌ | ✅ (próprios seminários) | ✅ |
| Adicionar/remover participantes em seminário | ❌ | ✅ (próprios seminários) | ✅ |
| Visualizar relatório de frequência do seminário | ❌ (só o próprio progresso) | ✅ (próprios seminários) | ✅ (todos) |
| Emitir/revogar certificado manualmente (exceção) | ❌ | ❌ | ✅ |
| Criar/remover Coordenadores | ❌ | ❌ | ✅ |
| **Suspender ações de um Coordenador** | ❌ | ❌ | ✅ |
| Definir diretrizes administrativas globais (configurações da plataforma) | ❌ | ❌ | ✅ |
| Acessar logs de auditoria | ❌ | ❌ | ✅ |

### 3.3 Regra de "suspensão de coordenador"

Isso implica um campo de estado no perfil do coordenador (`coordinator_status`: `active` / `suspended`), verificado por RLS/policy em toda operação de escrita feita por um coordenador (criar seminário, adicionar participante, etc.). Um coordenador suspenso mantém acesso de leitura, mas todas as policies de `INSERT`/`UPDATE` para suas tabelas de responsabilidade devem checar esse status.

---

## 4. Regras de Negócio: Frequência e Conclusão

Regra confirmada pelo cliente:

> O certificado é liberado **automaticamente** após a **data de término do seminário**, desde que o participante tenha **assistido 100% de todas as aulas** do seminário até aquele momento.

Desdobramentos técnicos necessários:

- **Rastreio de conclusão por aula**: como o vídeo é do YouTube, "assistir 100%" precisa ser medido via YouTube IFrame API, registrando o percentual assistido por sessão/usuário em `lesson_progress`. Definir um threshold de tolerância (ex.: ≥ 95% do tempo do vídeo = "concluído", já que o evento `onStateChange: ENDED` nem sempre dispara de forma confiável).
- **Reincidência de visualização**: se o participante reassiste, mantém o maior percentual já registrado (não zera o progresso).
- **Seminário sem data de término definida**: não deve ser possível publicar/ativar um seminário sem `end_date` preenchida, já que essa data é o gatilho de certificação.
- **Job de certificação**: roda diariamente (via `pg_cron` ou worker externo), verifica seminários cujo `end_date` já passou, e para cada `enrollment` sem certificado ainda emitido, checa se todas as aulas do seminário têm `lesson_progress.completed = true` para aquele usuário. Se sim → gera certificado.
- **Participante que não concluiu**: não recebe certificado automaticamente. Fica registrado como "não concluído" no relatório do coordenador. (A ser definido: haverá prazo de tolerância pós-`end_date` para o aluno terminar as aulas pendentes? — ver seção 9, Pontos em Aberto.)

---

## 5. Modelo de Dados (schema)

```
users
 ├─ id (uuid, pk, = auth.users.id)
 ├─ email
 ├─ full_name
 ├─ role            (enum: participant | coordinator | super_admin)
 ├─ coordinator_status (enum: active | suspended, nullable — só aplica a coordinators)
 ├─ created_at
 └─ updated_at

profiles
 ├─ user_id (fk -> users.id, pk)
 ├─ avatar_url
 ├─ bio
 ├─ phone
 └─ association_status   (ex.: membro associado / aspirante — se aplicável ao domínio)

seminars
 ├─ id (pk)
 ├─ title
 ├─ description
 ├─ coordinator_id (fk -> users.id)
 ├─ start_date
 ├─ end_date          -- obrigatório: gatilho de certificação
 ├─ status             (enum: draft | published | archived)
 ├─ max_seats           (nullable)
 ├─ cover_image_url
 └─ created_at

modules
 ├─ id (pk)
 ├─ seminar_id (fk -> seminars.id)
 ├─ title
 ├─ order_index
 └─ created_at

lessons
 ├─ id (pk)
 ├─ module_id (fk -> modules.id)
 ├─ title
 ├─ youtube_url
 ├─ youtube_video_id       -- extraído do link, usado pela IFrame API
 ├─ duration_seconds        -- opcional, cache vindo da YouTube Data API
 ├─ order_index
 └─ created_at

enrollments
 ├─ id (pk)
 ├─ user_id (fk -> users.id)
 ├─ seminar_id (fk -> seminars.id)
 ├─ enrolled_at
 ├─ enrolled_by (fk -> users.id)  -- coordenador ou admin que inscreveu
 └─ status             (enum: active | cancelled)

lesson_progress
 ├─ id (pk)
 ├─ user_id (fk -> users.id)
 ├─ lesson_id (fk -> lessons.id)
 ├─ max_watched_percent   (numeric 0-100)
 ├─ completed             (boolean)
 ├─ completed_at
 └─ last_updated_at

attendance   -- visão agregada/materializada, opcional se lesson_progress já cobre
 ├─ id (pk)
 ├─ user_id
 ├─ seminar_id
 ├─ percent_complete     (aulas concluídas / total de aulas)
 └─ updated_at

certificates
 ├─ id (pk)
 ├─ user_id (fk -> users.id)
 ├─ seminar_id (fk -> seminars.id)
 ├─ issued_at
 ├─ pdf_url
 ├─ validation_code       (usado na URL pública + QR Code)
 ├─ issued_by             (nullable — null = automático, ou user_id do admin em emissão manual)
 └─ revoked                (boolean, default false)

articles       -- materiais complementares (PDF, links, textos de apoio)
 ├─ id (pk)
 ├─ seminar_id (fk, nullable -- pode ser material geral)
 ├─ title
 ├─ file_url
 └─ created_at

settings
 ├─ key (pk)
 ├─ value (jsonb)
 └─ updated_at

audit_logs      -- adicionado: necessário para rastrear ações de suspensão/admin
 ├─ id (pk)
 ├─ actor_id (fk -> users.id)
 ├─ action
 ├─ target_table
 ├─ target_id
 ├─ metadata (jsonb)
 └─ created_at
```

### 5.1 RLS — diretrizes por tabela

| Tabela | Política |
|---|---|
| `users` | Usuário lê o próprio registro; Super Admin lê/edita todos; Coordenador lê participantes dos seus seminários (via join com `enrollments`). |
| `seminars` | Leitura pública (catálogo) para seminários `published`; escrita restrita ao `coordinator_id` responsável (se `coordinator_status = active`) ou Super Admin. |
| `modules` / `lessons` | Leitura restrita a participantes matriculados (`enrollments.status = active`) + coordenador do seminário + admin. Escrita: coordenador do seminário (ativo) + admin. |
| `enrollments` | Participante lê a própria; coordenador lê/escreve as do seu seminário; admin, todas. |
| `lesson_progress` | Só o próprio usuário escreve o próprio progresso; coordenador/admin só leem (agregados). |
| `certificates` | Participante lê o próprio; validação pública via `validation_code` (rota sem autenticação, expõe só dados não sensíveis: nome, seminário, data); admin com acesso total. |
| `audit_logs` | Somente Super Admin. |

---

## 6. Fluxos Principais

### 6.1 Participante
1. Login → Dashboard (seminários em andamento, progresso, certificados emitidos).
2. Catálogo → visualizar seminários publicados (inscrito ou não).
3. Assistir aulas dentro do Player (progresso salvo automaticamente via IFrame API).
4. Acompanhar % de frequência do seminário.
5. Após `end_date` + 100% concluído → certificado aparece automaticamente em "Meus Certificados", com botão de download PDF.

### 6.2 Coordenador
1. Login → Dashboard com seus seminários.
2. Criar/editar seminário (título, datas, módulos, aulas, materiais).
3. Adicionar/remover participantes (busca por e-mail/cadastro existente).
4. Acompanhar relatório de frequência em tempo real (Realtime).
5. **Bloqueio:** se `coordinator_status = suspended`, todas as ações de escrita acima retornam erro de permissão (tratado na UI com mensagem clara).

### 6.3 Super Admin
1. Cadastra novos Coordenadores.
2. Define diretrizes administrativas (via `settings` — ex.: % mínimo de conclusão, se diferente de 100% no futuro).
3. Pode suspender/reativar Coordenadores (toggle em `coordinator_status`, gera `audit_log`).
4. Acesso total a relatórios, usuários, seminários e emissão manual de certificados (exceção/correção).
5. Consulta `audit_logs`.

---

## 7. Certificação — Detalhamento

- **Critério:** 100% das aulas concluídas (≥ threshold definido, ex. 95% do tempo assistido por aula) **e** data atual ≥ `seminars.end_date`.
- **Geração:** PDF server-side com nome do participante, título do seminário, carga horária (soma de `duration_seconds` das aulas), data de conclusão, assinatura/logo da Sociedade.
- **QR Code:** aponta para `https://[dominio]/certificados/validar/{validation_code}` — rota pública, somente leitura, exibindo autenticidade sem exigir login.
- **Revogação:** Super Admin pode marcar `revoked = true` (ex.: erro de emissão) — a rota pública deve refletir esse estado.

---

## 8. Design System

Reaproveita o Design System do Portal institucional da Sociedade, adaptado para um ambiente de produtividade: menor densidade decorativa, foco em clareza de leitura, hierarquia visual voltada para progresso/andamento (barras de frequência, indicadores de conclusão), e consistência de componentes entre Portal e Learning para transição visual suave entre os dois sistemas.

---

## 9. Pontos em Aberto (precisam de decisão antes do desenvolvimento)

1. **Prazo de tolerância pós-`end_date`:** se um participante está em 90% de conclusão quando o seminário termina, ele perde o certificado definitivamente ou há um prazo extra para concluir?
2. **Inscrição:** é livre para qualquer visitante cadastrado, ou restrita a associados com "situação regular" (ex.: mensalidade em dia)? Isso afeta o campo `association_status` em `profiles`.
3. **Relação com o Portal institucional:** a base de usuários é compartilhada (SSO) entre Portal e Learning, ou são cadastros independentes?
4. **Carga horária acumulada:** os certificados devem alimentar um histórico de horas de formação continuada por associado ao longo do tempo (relatório consolidado), ou cada certificado é independente?
5. **Vagas limitadas (`max_seats`):** se atingido o limite, há lista de espera ou a inscrição simplesmente fecha?
6. **Notificações:** e-mail/aviso quando o seminário está prestes a começar, quando falta pouco para o fim e o aluno está com aulas pendentes, e quando o certificado é liberado.

---

## 10. Roadmap Sugerido

**Fase 1 — MVP**
- Login/Auth (Supabase Auth), RBAC básico (3 papéis)
- CRUD de Seminários/Módulos/Aulas (Coordenador/Admin)
- Player com embed YouTube + rastreio de progresso
- Matrícula manual (Coordenador adiciona participante)
- Relatório de frequência básico

**Fase 2 — Certificação**
- Job automático de emissão de certificado
- Geração de PDF + QR Code + rota pública de validação
- Emissão manual (exceção) pelo Super Admin

**Fase 3 — Administração e Auditoria**
- Painel de gestão de Coordenadores (criar/suspender)
- `audit_logs` e tela de consulta
- Configurações globais (`settings`)

**Fase 4 — Refinamentos**
- Notificações
- Relatórios consolidados de carga horária por associado
- Lista de espera / vagas limitadas
- Integração de identidade com o Portal (se confirmado SSO)

---

*Documento gerado como evolução da Spec 02 v1, incorporando definições de stack (Supabase self-hosted + Coolify), fonte de vídeo (YouTube), regra de certificação automática por data de término + conclusão de aulas, e matriz de papéis Participante / Coordenador / Super Admin.*
