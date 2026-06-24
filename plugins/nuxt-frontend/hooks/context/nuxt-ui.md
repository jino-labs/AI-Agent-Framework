## Nuxt UI v4 (auto-injected)

Single unified free package `@nuxt/ui` (^4.9) on Tailwind v4. Install:

```bash
pnpm add @nuxt/ui tailwindcss
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
})
```

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";
```

```vue
<!-- app/app.vue — <UApp> required for Toast/Tooltip/overlays -->
<template>
  <UApp>
    <NuxtLayout><NuxtPage /></NuxtLayout>
  </UApp>
</template>
```

- Components auto-imported with `U` prefix: layout/data `UCard UContainer UTable UModal USlideover UAccordion UTabs`; forms `UForm UInput USelect UButton UCheckbox UFormField`; feedback `UAlert UToast UBadge UProgress`; nav `UNavigationMenu UBreadcrumb UPagination`. 110+ total — prefer them over hand-rolled markup.
- **Theme in `app.config.ts`**, not scattered classes:
  ```ts
  export default defineAppConfig({
    ui: { colors: { primary: 'green', neutral: 'slate' } },
  })
  ```
- Color mode is bundled (`@nuxt/color-mode`); toggle via `useColorMode()`.
- **Forms:** `UForm :schema="zodSchema"` + `UFormField` per input; programmatic toasts via `useToast()`, overlays via `useOverlay()` (both need `<UApp>`).
- Works in plain Vue/Nuxt; here we target Nuxt 4. Per-component overrides via the `:ui` prop; don't fork components for small style tweaks.
