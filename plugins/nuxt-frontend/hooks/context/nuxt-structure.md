## Nuxt 4 structure & routing (auto-injected)

Nuxt 4 app code lives under `app/` (the srcDir); server code is top-level.

- `app/pages/` — file-based routes. `index.vue` → `/`, `[id].vue` → dynamic, `[...slug].vue` → catch-all, `(group)/` → ungrouped, nested dirs → nested routes. Add `<NuxtPage/>` in a parent `.vue` for nested layouts. No `pages/` dir at all → vue-router is dropped.
- `app/layouts/` — `default.vue` is implicit; pick another with `definePageMeta({ layout: 'name' })`. Layouts need a `<slot/>`.
- `app/middleware/` — `name.ts` route middleware applied via `definePageMeta({ middleware: ['name'] })`; suffix `.global.ts` to run on every navigation.
- `app/components/` — auto-imported, PascalCase. A subfolder prefixes the name (`components/Foo/Bar.vue` → `<FooBar/>`).
- `app/composables/`, `app/utils/`, `shared/` — auto-imported (no manual `import`).
- `server/api/*` — Nitro endpoints (`foo.get.ts`, `foo.post.ts`, `[id].get.ts`). `server/middleware/`, `server/utils/` are server-only.
- `shared/` — types/utils used by BOTH `app/` and `server/`. Never import `server/` into `app/`; cross only via HTTP + shared types.

Config in `nuxt.config.ts` (`modules`, `routeRules`, `runtimeConfig`). Navigate with `<NuxtLink>`/`navigateTo`, not `<a>`.
