---
description: Install, configure, and use the Nuxt UI v4 component library idiomatically — module setup, Tailwind v4 CSS, the UApp wrapper, app.config theming, forms, toasts/overlays, and picking the right U* component. Use when adding Nuxt UI, theming, or building UI with its components.
---

# Nuxt UI v4: $ARGUMENTS

Set up or use Nuxt UI v4 (`@nuxt/ui` ^4.9 — the unified free library, formerly UI + Pro) for
the scope in `$ARGUMENTS`, following `NUXT.md`.

## Install (if not present)

```bash
pnpm add @nuxt/ui tailwindcss
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({ modules: ['@nuxt/ui'], css: ['~/assets/css/main.css'] })
```

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";
```

```vue
<!-- app/app.vue — <UApp> is REQUIRED for Toast, Tooltip, and programmatic overlays -->
<template>
  <UApp>
    <NuxtLayout><NuxtPage /></NuxtLayout>
  </UApp>
</template>
```

## Using components

- Auto-imported with the `U` prefix — no manual import. Pick the right one:
  - **Layout/data:** `UCard`, `UContainer`, `UPage*`, `UTable`, `UModal`, `USlideover`, `UAccordion`, `UTabs`.
  - **Forms:** `UForm` (+ `:schema` Zod/Valibot/Yup), `UFormField`, `UInput`, `USelect`, `UTextarea`, `UCheckbox`, `URadioGroup`, `UButton`.
  - **Feedback/nav:** `UAlert`, `UBadge`, `UProgress`, `UToast`, `UNavigationMenu`, `UBreadcrumb`, `UPagination`, `UDropdownMenu`.
  - Prefer these over hand-rolled markup; 110+ components exist.
- **Forms:** wrap inputs in `UForm :state :schema`, one `UFormField` per input (label + error wiring). Validate client-side via schema and re-validate on the server route.
- **Programmatic:** `const toast = useToast(); toast.add({...})`; overlays via `useOverlay()` — both need `<UApp>`.

## Theming

- Centralize in `app/app.config.ts`, not scattered classes:
  ```ts
  export default defineAppConfig({ ui: { colors: { primary: 'green', neutral: 'slate' } } })
  ```
- Color mode is bundled — toggle with `useColorMode()`. Per-instance tweaks via the `:ui` prop; don't fork a component for a small change.

## Verify

Run the dev server and confirm components render + dark mode toggles. If Toast/overlays don't
appear, the app isn't wrapped in `<UApp>`.
