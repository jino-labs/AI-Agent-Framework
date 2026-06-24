## Nuxt rendering modes (auto-injected)

Default here is **universal SSR**. Tune per route with `routeRules` in `nuxt.config.ts` — don't flip the whole app to SPA to fix one page.

```ts
export default defineNuxtConfig({
  routeRules: {
    '/':            { prerender: true },          // SSG at build (static)
    '/blog/**':     { isr: 3600 },                // incremental static regen (Nitro)
    '/news/**':     { swr: 600 },                 // stale-while-revalidate cache
    '/admin/**':    { ssr: false },               // client-only SPA for this subtree
    '/api/**':      { cors: true },
    '/old':         { redirect: '/new' },
  },
})
```

- **SSR (default):** HTML rendered per request — best SEO + first paint, needs a Node/edge server.
- **SSG / `prerender`:** rendered at build, deploy static files. Use `nuxi generate` or `nitro.prerender`.
- **SPA / `ssr: false`:** ship an empty shell, render on the client. Use only for app-shell/dashboards behind auth where SEO is irrelevant.
- **Hybrid:** mix the above via `routeRules` (recommended) — static marketing pages + SSR app + SPA admin in one project.
- **`isr`/`swr`:** server-cached SSR for scale without losing freshness.

Remember SSR runs your setup code on the server: no `window`/`document` at top level (guard with `import.meta.client` or `onMounted`), and never use module-level singletons for state (see state context).
