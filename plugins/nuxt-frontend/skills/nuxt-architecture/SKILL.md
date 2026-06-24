---
description: Explain and set up the Nuxt 4 architectural pattern — app/ structure, app/server/shared boundary, file-based routing, data-fetching layers, rendering strategy, and state. Use when scaffolding a new Nuxt 4 project, organizing an existing one, or deciding where code belongs.
---

# Nuxt 4 architecture: $ARGUMENTS

Apply (or audit) the Nuxt 4 architectural pattern for the scope in `$ARGUMENTS`, following the
repo's `NUXT.md` (authoritative). Universal SSR is the default posture.

## The pattern

```
app/      pages · components · composables · layouts · middleware · plugins · utils · assets · app.vue · app.config.ts
server/   api · routes · middleware · utils         (Nitro — server-only)
shared/   types & pure utils shared by app + server (auto-imported both sides)
public/   static assets   ·   modules/   ·   nuxt.config.ts
```

Layered responsibilities, outermost → core:

1. **`app/pages`** — routes only; compose components, set `definePageMeta` + `useSeoMeta`. Thin.
2. **`app/components`** — presentation (Nuxt UI `U*`), typed props/emits. No data fetching beyond a passed-in composable.
3. **`app/composables`** — reusable logic + state (`useState`, `useFetch` wrappers). The seam for tests.
4. **`server/api`** — Nitro endpoints: validate input, hold secrets (`runtimeConfig`), call the real backend, return typed data.
5. **`shared/`** — the contract (types) between app and server.

## Steps

1. **Detect** the setup: glob for `nuxt.config.*`, `app/`, lockfile (pnpm/npm/bun), and existing pages/components to learn naming + package manager. New project → `npm create nuxt@latest`.
2. **Verify the stack:** Nuxt `^4.4`, Nuxt UI `^4.9` (`@nuxt/ui` + `tailwindcss`), Node 22+. Flag drift.
3. **Enforce the boundary:** no `server/`↔`app/` imports — cross via HTTP + `shared/` types. Secrets server-only.
4. **Place code** by the layers above; move anything misplaced (logic in pages → composables; types duplicated → `shared/`).
5. **Pick rendering** per route via `routeRules` (default SSR; `prerender`/`isr`/`swr`/`ssr:false`). Don't globally disable SSR for one route.
6. **State:** shared state via `useState`/composable/Pinia — never module-level `ref()` (SSR leak).

Hand structure decisions to the `nuxt-frontend-architect` agent and file-writing to
`nuxt-component-builder`. Output the target tree + where each piece goes; keep it minimal.
