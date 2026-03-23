# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup       # First-time setup: install deps, generate Prisma client, run migrations
npm run dev         # Start dev server with Turbopack
npm run build       # Production build
npm run lint        # ESLint
npm run test        # Run tests with Vitest (jsdom)
npm run db:reset    # Reset database (destructive)
```

Run a single test file: `npx vitest run src/components/__tests__/SomeComponent.test.tsx`

Environment: requires `ANTHROPIC_API_KEY` in `.env` (see `.env.example` if present).

## Architecture

UIGen is an AI-powered React component generator. Users describe components in natural language; Claude streams code back using tool calls, and a live iframe preview renders the result.

### Request Flow

1. User message → `POST /api/chat` (streaming, Vercel AI SDK)
2. Claude responds via `src/lib/provider.ts` (Anthropic model with fallback mock)
3. Claude calls tools (`str_replace_editor`, `file_manager` in `src/lib/tools/`) to create/edit virtual files
4. Virtual file system (`src/lib/file-system.ts`) tracks files in-memory — **no disk writes**
5. `PreviewFrame` renders files in an iframe using Babel for on-the-fly JSX transpilation
6. For authenticated users, the project (messages + file state) is persisted to SQLite via Prisma

### Key Areas

- **`src/app/api/chat/route.ts`** — Streaming chat endpoint; wires together the AI model, tools, and virtual FS
- **`src/lib/tools/`** — AI tool definitions (`str_replace_editor` for edits, `file_manager` for creates/deletes)
- **`src/lib/prompts/`** — System prompts that guide Claude's code generation behavior
- **`src/lib/file-system.ts`** — Virtual FS abstraction (files live in React state, not on disk)
- **`src/components/preview/PreviewFrame.tsx`** — Iframe sandbox that Babel-transpiles and executes generated code
- **`src/lib/auth.ts`** — JWT session management using `jose`; sessions stored in cookies
- **`src/middleware.ts`** — Protects `/api/projects` and `/api/filesystem` routes via JWT validation
- **`src/actions/`** — Server actions for project CRUD (backed by Prisma + SQLite at `prisma/dev.db`)

### Auth Model

- Anonymous users can generate components; work is persisted locally via `src/lib/anon-work-tracker.ts` (localStorage)
- On sign-in/sign-up, anonymous work is migrated to the user's account
- Passwords hashed with bcrypt; sessions are short-lived JWTs

### Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).
