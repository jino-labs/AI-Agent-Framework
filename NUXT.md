# Nuxt 4 Frontend — Agent Conventions

Canonical conventions for building **Nuxt 4 + Nuxt UI v4** frontends in this codebase. Every
AI agent — Claude Code, GitHub Copilot, or otherwise — must follow these rules. Claude
agents/skills and Copilot instruction files all defer to this file as the source of truth.
(The backend counterpart is [`AGENTS.md`](./AGENTS.md) for .NET DDD APIs.)

## Pinned versions

| Thing | Version | Notes |
|---|---|---|
| **Nuxt** | `^4.4.0` | `app/` srcDir, file-based routing, Nitro server. |
| **Nuxt UI** | `^4.9.0` | Single unified free package `@nuxt/ui` (UI + former Pro). |
| **Tailwind CSS** | `^4` | Nuxt UI v4 builds on Tailwind v4 (CSS-first config). |
| **Node** | `>=22` | Use an even LTS (22, 24). |
| **Vue** | 3.5+ / `<script setup lang="ts">` | TypeScript everywhere. |

Default posture: **universal (SSR) rendering** with a Nitro `server/` API layer; opt into
SPA/SSG/hybrid per route via `routeRules` (see `hooks/context/rendering.md`).

## Project structure

Nuxt 4 puts app code under `app/` (the srcDir). Server code is top-level.

```
app/
  app.vue            # root component — wrap in <UApp> for Nuxt UI
  app.config.ts      # runtime UI theme/config (ui: { colors, ... })
  assets/css/main.css# Tailwind + Nuxt UI import
  components/        # auto-imported, PascalCase; subfolders => prefix
  composables/       # auto-imported use* functions (state, logic)
  layouts/           # default.vue + named layouts
  middleware/        # route middleware (name.ts -> definePageMeta)
  pages/             # file-based routes ([id].vue, index.vue)
  plugins/           # client/server plugins (.client/.server suffix)
  utils/             # auto-imported pure helpers (no Vue runtime)
server/
  api/               # Nitro endpoints (foo.get.ts, foo.post.ts)
  routes/            # non-/api server routes
  middleware/        # server middleware (runs every request)
  utils/             # server-only helpers (auto-imported in server/)
shared/              # types/utils shared by BOTH app and server (auto-imported)
public/              # served as-is at site root
modules/             # local Nuxt modules
nuxt.config.ts       # modules, routeRules, runtimeConfig
```

Boundary rules:
- **Never import `server/` code into `app/` or vice-versa.** Cross the boundary only over HTTP (`$fetch`/`useFetch`) and share **types** via `shared/`.
- Secrets live in `runtimeConfig` (server-only) — never in `runtimeConfig.public` unless truly public, never hard-coded in components.

## Data fetching

- Render-blocking data for a page/component → **`useFetch`** (or `useAsyncData` + `$fetch` when you need control). SSR-safe, dedupes, transfers payload to client (no double fetch).
- Event handlers / imperative calls (submit, click) → **`$fetch`** directly. Never `useFetch` in a handler.
- Always key async data and handle `pending`/`error`/`status`. Use `lazy`/`server`/`watch` options deliberately.
- Backend calls go to `server/api/*` (Nitro) which proxies the real API — keeps tokens server-side.

## State

- Cross-component shared state → **`useState('key', () => init)`**, never module-level `ref()`/global singletons (those leak across requests on the server → data bleed between users).
- Heavy/structured state → **Pinia** (`@pinia/nuxt`).
- Per-component logic → composables in `app/composables/` (auto-imported `use*`).

## Nuxt UI

- Add module `@nuxt/ui` + dep `tailwindcss`; import `tailwindcss` and `@nuxt/ui` in `app/assets/css/main.css`; wrap `app.vue` in `<UApp>` (required for Toast/Tooltip/overlays).
- Components are auto-imported with the `U` prefix (`UButton`, `UCard`, `UForm`, `UTable`, `UModal`, …). 110+ components — prefer them over hand-rolled markup.
- Theme via `app.config.ts` (`ui: { colors: { primary, neutral }, ... }`), not scattered classes. Color mode via `@nuxt/color-mode` (bundled).
- Forms: `UForm` + a schema (Zod/Valibot/Yup) — validate on the client and re-validate on the server route.

## Coding conventions

- **`<script setup lang="ts">`** SFCs. Typed `defineProps`/`defineEmits` (prefer generics / `withDefaults`). `defineModel` for two-way props.
- **Naming:** components PascalCase (`UserCard.vue`), composables `useThing`, pages kebab/`[param]`, server routes `name.method.ts`.
- **Auto-imports:** do not manually import Vue/Nuxt composables, components, or `utils/`,`composables/`,`shared/` members — they are auto-imported. Manual imports only for npm packages.
- **`definePageMeta`** for layout/middleware/auth on a page; **`useHead`/`useSeoMeta`** for title/meta.
- **Accessibility:** Nuxt UI components are accessible by default — keep labels, `aria-*`, and focus order intact; every interactive element reachable by keyboard.
- Keep components small; push logic into composables; push data shape into `shared/` types.

## Adding a feature (page) — touch order

To add feature `Foo`, mirror an existing page/feature in the project:

1. `shared/types/foo.ts` — the `Foo` type shared by app + server.
2. `server/api/foo/index.get.ts` (+ `[id].get.ts`, `index.post.ts`, …) — Nitro endpoints, validate input, talk to the real backend, return typed data.
3. `app/composables/useFoo.ts` — `useFetch`/`useAsyncData` wrappers + any `$fetch` mutations.
4. `app/components/Foo/FooList.vue`, `FooForm.vue`, … — Nuxt UI components, typed props/emits.
5. `app/pages/foo/index.vue` (+ `[id].vue`) — compose components, `definePageMeta`, `useSeoMeta`.
6. `app/middleware/*` if the route needs auth/guards; register layout if needed.
7. `nuxt.config.ts` `routeRules` if this route needs a non-default rendering mode.
8. Tests (Vitest + `@nuxt/test-utils`) for composables/components and a server-route test.

## Security / data protection

- Never expose secrets to the client; keep them in `server/` + `runtimeConfig`.
- Validate and sanitize all input on the server route, not just the client form.
- Never log tokens/PII; for personal data apply data minimization and support erasure (mirror `AGENTS.md` GDPR posture for the API side).
