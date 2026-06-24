---
description: Review a diff or set of files in a Nuxt 4 app for structure, data-fetching, state, rendering, Nuxt UI, and accessibility convention violations. Use for "review this for Nuxt issues".
---

# Nuxt convention review: $ARGUMENTS

Review the current diff (or the files/scope in `$ARGUMENTS`) against `NUXT.md`. Report problems
only — one line each, location + issue + fix. No praise, no style nits that don't change meaning.

## Check for

- **Boundary breaks:** `server/` code imported into `app/` (or vice-versa) instead of crossing via HTTP + `shared/` types; secrets in the client bundle or `runtimeConfig.public`.
- **Data fetching:** `useFetch`/`useAsyncData` called in an event handler; `$fetch` used for render-blocking page data; async composables called conditionally / after an `await`; missing `status`/`error` handling; calling the backend directly instead of a `server/api` route.
- **State:** module-level `ref()`/singleton for shared state (SSR cross-request leak) instead of `useState`/Pinia.
- **Rendering:** whole-app `ssr: false` to fix one route instead of a `routeRules` entry; `window`/`document` accessed at setup top level without an `import.meta.client`/`onMounted` guard.
- **Structure:** logic in pages instead of composables; types duplicated instead of in `shared/`; components not auto-import-friendly (wrong folder/name).
- **Auto-imports:** manual imports of Vue/Nuxt composables, components, or `composables/`,`utils/`,`shared/` members.
- **Nuxt UI:** hand-rolled markup where a `U*` component fits; theming via scattered classes instead of `app.config.ts`; forms without `UForm`/`UFormField` + schema; `useToast`/overlays without `<UApp>`.
- **Meta/SEO:** missing `useSeoMeta`/`useHead`; `<a>`/manual routing instead of `<NuxtLink>`/`navigateTo`.
- **Accessibility:** missing labels/`aria-*`, broken focus order, non-keyboard-reachable controls.
- **Types:** untyped `defineProps`/`defineEmits`; `any` across the app/server contract.

Get the diff with `git diff` if no scope is given. End with a short pass/fail verdict.
