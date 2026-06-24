## Nuxt state management (auto-injected)

- **`useState('key', () => initial)`** — the SSR-safe shared-state primitive. Serialized from server to client. **Always use this, never a module-level `ref()`/global object** — module-level state is shared across all requests on the server and leaks one user's data into another's.
- **Composables** (`app/composables/useThing.ts`, auto-imported) — wrap `useState` + logic into a reusable `use*` function. Keep components thin.
- **Pinia** (`@pinia/nuxt`) — for larger/structured stores. `defineStore` with `setup` syntax; SSR-safe out of the box with the Nuxt module.
- `provide`/`inject` only for deep, scoped component trees — not a substitute for `useState`/Pinia.
- Persist to cookies with **`useCookie`** (SSR-safe, sent with requests) for things like theme/auth flags.

Rule of thumb: per-component → `ref` in `setup`; shared across components → `useState`/composable; app-wide structured → Pinia.
