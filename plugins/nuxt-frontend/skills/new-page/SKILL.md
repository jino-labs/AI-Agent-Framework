---
description: Scaffold a new Nuxt 4 route/page end-to-end — shared type, Nitro server route, composable, Nuxt UI components, the page, and its meta/middleware — mirroring an existing feature. Use when adding a route or screen to a Nuxt app.
---

# New Nuxt page: $ARGUMENTS

Scaffold the feature named in `$ARGUMENTS` (e.g. `Dashboard`, `users/[id]`) following the
"Adding a feature (page)" touch-order in `NUXT.md`. Mirror an existing page/feature as the
template — match folder layout, naming, and the project's package manager.

## Steps

1. **Locate** the project: glob `nuxt.config.*`, `app/pages/`, `server/api/`, `shared/`. Find a similar existing feature to copy the pattern.
2. **Plan** with the `nuxt-frontend-architect` agent (or inline): produce the ordered touch-list.
3. **Build, in dependency order:**
   - `shared/types/<feature>.ts` — the data type used by app + server.
   - `server/api/<feature>/...` — Nitro endpoints (`index.get.ts`, `[id].get.ts`, `index.post.ts`), validate input, read secrets from `runtimeConfig`, return the shared type.
   - `app/composables/use<Feature>.ts` — `useFetch`/`useAsyncData` for reads, `$fetch` for mutations.
   - `app/components/<Feature>/...` — Nuxt UI `U*` components, typed props/emits.
   - `app/pages/<route>.vue` — compose components, `definePageMeta` (layout/middleware), `useSeoMeta`.
4. **Rendering:** add a `routeRules` entry in `nuxt.config.ts` only if this route needs a non-default mode (prerender/isr/swr/ssr:false).
5. **Guards:** add `app/middleware/*` if the route needs auth.
6. **Tests:** Vitest + `@nuxt/test-utils` for the composable + a server-route test.
7. **Verify:** `pnpm dev` (or npm/bun) and load the route; `pnpm typecheck`/`nuxi typecheck`.

Ask which fields the data has and whether the route is authenticated if `$ARGUMENTS` doesn't
say. Keep each layer minimal — a static page may need no server route or composable.
