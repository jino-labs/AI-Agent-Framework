---
applyTo: "**/*.vue,**/nuxt.config.*,**/app.config.*,**/app/**,**/server/**,**/shared/**,**/layouts/**,**/pages/**,**/composables/**"
---

# Nuxt 4 frontend

Full ruleset in [`NUXT.md`](../../NUXT.md) (source of truth). Short version:

- **Stack:** Nuxt `^4.4`, Nuxt UI `^4.9` (`@nuxt/ui` + `tailwindcss`), Node 22+, `<script setup lang="ts">`. Default rendering is universal SSR.
- **Structure:** app code under `app/` (pages, components, composables, layouts, middleware, plugins, utils); `server/` for Nitro API; `shared/` for types/utils used by both. Never import `server/`↔`app/` — cross via HTTP + `shared/` types.
- **Data:** render-blocking → `useFetch`/`useAsyncData` at top of setup; handlers/mutations → `$fetch`. Hit `server/api/*` (keeps secrets server-side via `runtimeConfig`); always render `status`/`error`.
- **State:** shared state via `useState`/composable/Pinia — never module-level `ref()` (SSR cross-request leak). Cookies via `useCookie`.
- **Rendering:** tune per route with `routeRules` (`prerender`/`isr`/`swr`/`ssr:false`); don't disable SSR app-wide for one route. No `window`/`document` at setup top level without an `import.meta.client`/`onMounted` guard.
- **Nuxt UI:** prefer `U*` components; wrap `app.vue` in `<UApp>`; theme via `app.config.ts`; forms use `UForm :schema` + `UFormField`. Components/composables/`utils`/`shared` are auto-imported — don't manually import them.
- **Naming/meta:** PascalCase components, `use*` composables, `name.method.ts` server routes; `definePageMeta` for layout/middleware, `useSeoMeta` for meta, `<NuxtLink>`/`navigateTo` for navigation. Keep components accessible.
