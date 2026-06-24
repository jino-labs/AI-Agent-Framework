---
description: Scaffold a new Nuxt 4 / Vue component (and optional composable) using Nuxt UI v4, typed script-setup props/emits, and SSR-safe patterns. Use when adding a reusable component or extracting UI into one.
---

# New Nuxt component: $ARGUMENTS

Create the component named in `$ARGUMENTS` following `NUXT.md`. Mirror an existing component
in the project for style and naming.

## Steps

1. **Place it:** `app/components/<Subfolder>/<Name>.vue` (PascalCase). Remember a subfolder becomes a prefix in the auto-import (`components/Foo/Bar.vue` → `<FooBar/>`).
2. **Build the SFC:**
   - `<script setup lang="ts">`. Typed `defineProps`/`defineEmits` (use `withDefaults` / generics); `defineModel` for two-way props.
   - Prefer Nuxt UI `U*` components for markup (`UCard`, `UButton`, `UForm`, `UFormField`, `UInput`, `UTable`, `UBadge`, …). Theme via `app.config.ts`; per-instance overrides via the `:ui` prop, not forked components.
   - No manual imports of Vue/Nuxt composables, sibling components, or `composables/`,`utils/`,`shared/` — they auto-import.
   - SSR-safe: no `window`/`document` at top level (guard with `import.meta.client` or `onMounted`).
3. **Extract logic** to `app/composables/use<Name>.ts` if there's state/fetching — keep the component presentational. Shared state → `useState`, never module-level `ref()`.
4. **Data:** if the component fetches, accept the data via props or a composable; mutations use `$fetch`. Render `status`/`error`.
5. **Accessibility:** labels, `aria-*`, keyboard focus order intact.
6. **Test:** a Vitest component test (or assert the composable) via `@nuxt/test-utils`.

Ask for the props/emits shape if `$ARGUMENTS` doesn't specify. Keep it small and reusable.
