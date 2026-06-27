# Engineering Guide

For developers working on this codebase. Assumes you know the stack. If you need project context, read `AGENTS.md` first.

---

## Design Philosophy

**This is a single-developer project.** Every decision prioritizes:

1. **Fewer files** — avoid unnecessary abstraction layers. A service class that wraps a single axios call isn't "clean architecture", it's a detour. We do it anyway (Next.js App Router means no in-app RPC, so services centralize URL/path logic), but keep them thin.
2. **Boring choices** — shadcn/ui, Prisma, Axios, react-hook-form. Nothing clever. If a pattern works in 10 other Next.js apps, it works here.
3. **No premature multi-tenancy** — everything scoped to `userId`. No org/workspace layer. If you see a `userId` threaded through a constructor, that's not a design choice, it's the absence of auth context in the data layer.
4. **shadcn/ui is not a design system** — components are committed, not published. Modify them directly. Don't wrap them in another abstraction.

## Architecture

```
Browser                  Server                  Database
──────                  ──────                  ────────
React components  ──>  Next.js API routes  ──>  PostgreSQL
  (pages)                (app/api/*)             (Prisma)
       │                      │
       │ Axios                │ better-auth
       ▼                      ▼
  Service classes          Auth middleware
  (services/*)             (proxy.ts)
```

Data flows: client calls `Service.method()` → Axios → API route → Prisma → PostgreSQL. Response bubbles back through the same chain wrapped in `ApiResponse<T>`.

**Note:** The Prisma model was renamed from `Company` to `Space` mid-project. The DB table stays `company` via `@@map()`. See the migration commit for the full scope.

No server actions. No tRPC. No GraphQL. REST-style API routes with JSON bodies.

## Key Decisions

### Why Axios + services instead of server actions / tRPC

Next.js App Router makes RPC impractical without a framework. Axios is fine. Service classes centralize URL construction and error handling so components don't scatter API calls. The pattern is: one service class per resource, one file per service.

### Why `userId` in service constructors

Better Auth provides session server-side but client-side services don't have automatic access to it. The `userId` is passed in from the component that has the session. This is manual but explicit. If this bothers you, consider an Axios interceptor that reads from `authClient.getSession()`, but that adds async to every request setup — not worth it yet.

### Why two AI service files

- `services/ai.provider.service.ts` — server-side adapter pattern (provider interface → implementation)
- `services/ai.generate.service.ts` — client-side logic class specific to logbook operations

They overlap. `ai.generate.service.ts` is the one actually used. `ai.provider.service.ts` exists because at one point there was a plan to support multiple providers via strategy pattern. That plan is incomplete (DeepSeek config exists but no provider, OpenAI is in dependencies but unused).

### Why generated Prisma client in `generated/` instead of `node_modules/`

Explicit output path via `prisma-client` generator (not the default `prisma-client-js`). Gives control over where types live and avoids node_modules import issues. The adapter `@prisma/adapter-pg` is used instead of the default driver — this was an explicit choice for serverless edge compatibility.

### Why `proxy.ts` instead of Next.js middleware

Next.js middleware runs on the Edge Runtime, which doesn't support better-auth's database adapter. `proxy.ts` is a regular route that runs on Node.js. Consequence: it only matches paths defined in the `config.matcher` export and doesn't run on static files or non-matching routes. This means protected pages get a flash of unauthenticated content before the client-side auth check resolves.

## Project Conventions

### Files

| Pattern | Convention |
|---|---|
| `app/**/page.tsx` | Page component. Server component by default, `"use client"` if interactive. |
| `app/**/route.ts` | API handler. Named exports: `GET`, `POST`, `PUT`, `DELETE`. |
| `components/**/*.tsx` | React components. One per file. |
| `services/*.ts` | Client-side API wrappers. Class per resource. |
| `schemas/*.ts` | Zod validation schemas. |
| `lib/api/*.ts` | Client-side API call wrappers (where `services/` feels too heavy). |
| `types/prisma/*.ts` | Prisma query payload types. `space.ts` was renamed from `companies.ts`. |

### API response shape

Every API response follows `ApiResponse<T>`:

```typescript
{ data: T, message: string, code: number, status: "success" | "error" }
```

Use `serverSuccessResponse()` / `serverErrorResponse()` in routes.
Use `successResponse()` / `errorResponse()` on the client.

### Routes

Naming convention follows REST-ish hierarchy:

```
/api/spaces
/api/spaces/[spaceId]
/api/spaces/[spaceId]/positions
/api/spaces/[spaceId]/positions/[positionId]/projects
```

But this is inconsistent — some routes accept `userId` as a path param (`/api/logbooks/[userId]`), others use the session directly. If adding a new route, prefer session-based auth over path params for the user ID.

### AI prompt system

Prompts are built by chaining instructions on `AIPromptBuilder`:

```typescript
const builder = new AIPromptBuilder();
builder.base(); // system prompt: "you are helpful assistant"
builder.addInstruction({ role: "system", content: "..." });
builder.formatOutput(expectedShape);
const prompt = await builder.execute();
```

The builder doesn't call AI — it only constructs the prompt string. AI invocation happens in the API route or provider class.

### Error handling

Routes return `serverErrorResponse()` with appropriate HTTP status codes. Service classes catch axios errors and re-throw as `Error(message)`. Components catch and show toast. No global error boundary catches API errors — they surface via the promise chain or get swallowed in console.error.

## Database

### Migrations

```bash
npx prisma migrate dev --name <descriptive-name>
npx prisma migrate deploy           # production
```

### Schema conventions

- Table names snake_case via `@@map()`
- All models have `id` as `String @id @default(uuid())` (except User/Session/Account which use the auth provider's ID)
- Timestamps: `createdAt` and `updatedAt` on everything
- Soft delete via nullable `deletedAt` (currently only on Logbook)

## Current Gotchas

1. **proxy.ts doesn't protect static files** — Next.js middleware replacement only covers explicit path patterns. `/dashboard` is protected, `/dashboard/not-a-real-route` is not. Rely on client-side session check for deep links.
2. **Two code paths for AI** — `services/ai.generate.service.ts` and `lib/api/ai-generate.api.ts` do almost the same thing. The `lib/api` version is leaner. No one has decided which to keep.
3. **`insight.logbook.ts` is a stub** — file exists, exports nothing. Leftover from planned but unbuilt insight feature.
4. **`types/ai.ts` is unused** — single interface `AIInstance { token: string }` not referenced anywhere.
5. **`next.config.ts` is default** — no PWA plugin, no redirects, no image domains configured. The manifest and icons are in `public/` but served via metadata API in `layout.tsx` and `manifest.ts`.
6. **Google OAuth config uses `!` non-null assertion** — `process.env.GOOGLE_CLIENT_ID!` will crash at runtime if env vars are missing. Startup check not implemented.
7. **Passkeys require HTTPS** — won't work in dev without `localhost` or a tunnel.
8. **Token calculator uses weekly limit** — `config.ai.weeklyLimit` is 3000, but the reset logic is manual (ISO week start query). No cron/prisma job resets anything — it's just a filter in the query.
9. **`usedTokenPercentage` threshold bug** — `ai.provider.tsx` checks `if (usedTokenPercentage <= 0)` to block usage, but `remainingPercentage` is the variable name. It reads "if remaining <= 0, block" which is correct, but the naming is misleading.
10. **Prisma adapter vs driver** — uses `@prisma/adapter-pg` with a connection string, not the default driver. If you see `PrismaClient` initialized without an adapter, that's the old pattern — don't copy it.

## Local Development

```bash
npm install
cp .env.example .env  # fill in: DATABASE_URL, BETTER_AUTH_URL, GOOGLE_* keys, AI keys
npx prisma migrate dev
npm run dev
```

BETTER_AUTH_URL should be `http://localhost:3000` in dev.

## Testing

No test framework is set up. No unit, integration, or e2e tests exist. This is not ideal, but it's the current state. If adding tests, Vitest is the closest match to the existing tooling (Vite-based Next.js). Playwright for e2e if needed.

---

*This file describes how the project works today, not how it should work. Update it when patterns change.*
