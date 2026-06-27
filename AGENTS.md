# Better Logbook — AI Context

## What

Personal logbook app. Track daily work, tag entries by project, get AI-powered improvements and insights. Built for professionals who want output records without friction.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, `app/` dir) |
| Language | TypeScript strict |
| Styling | Tailwind CSS v4 + shadcn/ui components |
| DB | PostgreSQL + Prisma 7 (adapter `@prisma/adapter-pg`) |
| Auth | Better Auth (email/password, Google OAuth, passkeys) |
| AI | Google Gemini (via `@google/genai`) + DeepSeek config exists |
| HTTP | Axios client-side |
| Forms | react-hook-form + zod |
| State | React Context + TanStack Query |
| Charts | recharts |
| PWA | manifest + icons, display: standalone |

## Project Map

```
├── AGENTS.md              ← this file
├── app/                   # Next.js App Router pages + API routes
│   ├── (landing-page)/    # Public landing page
│   ├── _providers/        # React context providers (auth, AI, UI)
│   ├── api/               # API routes
│   │   ├── ai/            # AI generation endpoint
│   │   ├── spaces/        # CRUD spaces (with positions nested)
│   │   ├── logbooks/      # CRUD logbook entries
│   │   ├── positions/     # CRUD positions (with projects nested)
│   │   ├── projects/      # CRUD projects
│   │   ├── tags/          # Tag CRUD
│   │   └── auth/          # Better Auth handler (catch-all)
│   ├── auth/              # Sign in/up pages
│   ├── dashboard/         # Authenticated dashboard pages
│   └── user/              # User profile pages
├── components/            # UI components
│   ├── ui/                # shadcn primitives (button, card, input, table, chart, sidebar...)
│   ├── app-sidebar.tsx    # Sidebar nav with spaces/positions/projects
│   ├── site-header.tsx    # Top header with breadcrumb
│   ├── nav-*.tsx          # Nav section components
│   ├── modal.tsx          # Vaul-based drawer/modal
│   └── chart-area-interactive.tsx  # Recharts area chart
├── lib/
│   ├── auth.ts            # Better Auth server instance
│   ├── auth-client.ts     # Better Auth client (browser)
│   ├── prisma.ts          # Prisma client singleton
│   ├── config.ts          # App config (auth, AI providers)
│   ├── api.response.ts    # API response helpers (success/error wrappers)
│   ├── axios.ts           # Axios instance with error interceptor
│   ├── ai/                # AI subsystem
│   │   ├── ai.prompt.ts            # Prompt builder (role/content chain)
│   │   ├── providers/              # AI provider implementations
│   │   │   ├── ai.provider.interface.ts  # AIProvider interface
│   │   │   └── ai.google.ts              # Google Gemini provider
│   │   ├── instructions/           # Prompt templates
│   │   │   ├── entry.logbook.ts    # Improve / extract details from entries
│   │   │   └── insight.logbook.ts  # (unused stub)
│   │   └── token.calculator.ts     # Track weekly token usage vs limit
│   └── api/               # Client-side API call wrappers
│       ├── ai-generate.api.ts
│       └── ai-usage.api.ts
├── services/              # Client-side service classes (call API via axios)
│   ├── space.ts           # SpaceService
│   ├── position.ts        # PositionService
│   ├── project.ts         # ProjectService
│   ├── logbook.ts         # LogbookService
│   ├── tag.ts             # TagService
│   ├── ai.generate.service.ts   # LogbookAIService (improve + extract)
│   └── ai.provider.service.ts   # AIProviderService (generic ask wrapper)
├── schemas/               # Zod validation schemas
│   ├── logbook.ts, login.ts, sign-up.ts, profile.ts
│   ├── project.ts, position.ts, space.ts, quick-create.ts
├── types/
│   ├── user.ts            # User, UserSignUp, UserLogin interfaces
│   ├── ai.ts              # (unused stub)
│   └── prisma/            # Prisma query payload types
│       ├── space.ts       # SpaceWithPositions
│       └── project.ts     # ProjectWithRelations
├── generated/prisma/      # Prisma client output (gitignored)
└── prisma/
    └── schema.prisma      # DB schema
```

## Data Model (simplified)

```
User ──> Space ──> Position ──> Project ──> Logbook (1-per-day-per-project)
User ──> AiTokenUsage
Logbook ──> Tag (M:N via LogbookTag)
```

Key constraints: one logbook entry per `(projectId, logDate)`, soft-delete via `deletedAt`.

## Auth Flow

- **better-auth** handles sessions server-side + client-side
- `proxy.ts` middleware redirects unauthenticated users from `/dashboard/*` and `/user/*` to sign-in
- Auth providers: email/password, Google OAuth, passkeys (WebAuthn)
- Client: `authClient` from `@better-auth/react` exposes `useSession()`, `signIn`, `signUp`, `signOut`

## API Patterns

- Every API route returns `ApiResponse<T>` (`{ data, message, code, status }`)
- Services (client-side) call API via Axios, wrap in try/catch, re-throw on error
- Validation at both schema level (zod) and API route level
- Route paths: `/api/spaces/[spaceId]`, `/api/spaces/[spaceId]/positions`, etc.

## AI Subsystem

- **Google Gemini** is the active provider (Gemini 3.1 Flash Lite)
- DeepSeek config exists but no provider implemented
- Weekly token limit enforced server-side (config: 3000 total)
- `AIPromptBuilder` constructs prompt from role/content instructions
- Two operations on logbook text: **improve** (rewrite) and **extract details** (title + tags)
- Token usage tracked in `AiTokenUsage` table per-user

## Component Conventions

- **shadcn/ui** primitives in `components/ui/`
- App components in `components/` — sidebar, header, nav sections
- `"use client"` where React hooks/state needed
- `cn()` utility for conditional Tailwind classes (clsx + tailwind-merge)
- Sidebar uses `@tabler/icons-react`, app-wide also `lucide-react`
- Modals via `vaul` (drawer component)

## Routing

| Path | Access |
|---|---|
| `/` | Landing page |
| `/auth/sign-in`, `/auth/sign-up` | Public |
| `/dashboard/*` | Auth required |
| `/user/*` | Auth required |
| `/api/*` | Auth required (API middleware) |

## Build & Deploy

- `npm run dev` — Next.js dev server
- `npm run build` — prisma generate + migrate deploy + next build
- `npm run format` — Prettier (with import sorting)
- Deployed on Vercel

## Common Tasks for AI

### Adding new page

1. Create `app/<route>/page.tsx` (server component)
2. Add to sidebar in `components/app-sidebar.tsx`
3. Add API route if needed in `app/api/<resource>/route.ts`
4. Add service class in `services/` if client calls it
5. Add zod schema in `schemas/` if form validation needed

### Adding new API endpoint

1. Create `app/api/<resource>/route.ts` exporting GET/POST/PUT/DELETE
2. Use `auth.api.getSession()` to get user
3. Return `serverSuccessResponse()` / `serverErrorResponse()`
4. Add client service class in `services/`

### Adding AI feature

1. Add instruction template in `lib/ai/instructions/`
2. Extend `LogbookAIService` or create new service
3. Wire into context provider or component
4. Add prompt/mock output in instruction file

### DB changes

1. Edit `prisma/schema.prisma`
2. `npx prisma migrate dev --name <name>`
3. Update query payload types in `types/prisma/`
