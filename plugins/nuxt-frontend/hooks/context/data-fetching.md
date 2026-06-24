## Nuxt data fetching (auto-injected)

- **`useFetch(url, opts)`** — render-blocking data for a page/component. SSR-safe, deduped, payload transferred to the client (no refetch on hydration). Returns `{ data, status, error, refresh, clear }`.
- **`useAsyncData(key, () => $fetch(...))`** — same guarantees with full control (custom keys, combining calls, transform). Use when `useFetch`'s URL shorthand isn't enough.
- **`$fetch(url, opts)`** — for **event handlers / mutations** (submit, click, POST/PUT/DELETE). Never call `useFetch`/`useAsyncData` inside a handler (it won't be SSR-tracked and may double-fire).
- Options that matter: `lazy` (don't block navigation), `server: false` (client-only), `watch`/`key` (refetch deps), `pick`/`transform` (trim payload), `default` (SSR fallback). Always render `status`/`error` states.
- Talk to your backend through **`server/api/*`** Nitro routes so auth tokens stay server-side; the page calls the Nitro route, the route calls the real API using `runtimeConfig` secrets.
- `useFetch`/`useAsyncData` must be called at the top level of `setup` (not conditionally / not after `await` before them).
