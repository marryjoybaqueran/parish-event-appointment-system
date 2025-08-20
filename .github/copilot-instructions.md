
# Copilot Instructions 

## Project Overview
- **Frameworks:** Vue 3 (Composition API), TypeScript, Pinia (state), Vuetify (UI), Supabase (backend)
- **Structure:**
  - `src/components/`: UI components, organized by domain (e.g., `common/`, `layout/`)
  - `src/views/`: Page-level views, often grouped by feature/module
  - `src/stores/`: Pinia stores for state management, one per domain entity
  - `src/router/`: Vue Router setup and route definitions
  - `src/utils/`: Shared utilities, helpers, and configuration (e.g., `vuetify/`)

## Key Patterns & Conventions
- **Table/Data Patterns:**
  - Data tables use `v-data-table-server` (Vuetify) with server-side pagination, filtering, and expansion rows for details.
  - Table logic (filters, options, actions) is abstracted into composables (e.g., `useTripsTable` in `tripsTable.ts`).
- **Dialogs & Forms:**
  - CRUD dialogs are implemented as separate components (e.g., `TripsFormDialog.vue`) and controlled via composable state.
  - Confirmation dialogs use a shared `ConfirmDialog.vue`.
- **State Management:**
  - Each major entity (e.g., trips, employees) has a dedicated Pinia store in `src/stores/`.
  - Stores handle API calls, caching, and are injected into components/composables.
- **API/Backend:**
  - Supabase is used for backend data and authentication, with logic in `src/utils/supabase.ts`.
- **UI/UX:**
  - Vuetify is the primary UI library; custom configuration in `src/utils/vuetify/`.
  - Mobile responsiveness is handled via Vuetify's `useDisplay` and conditional rendering.

## Developer Workflows
- **Build:** `npm run build` (uses Vite)
- **Dev:** `npm run dev` (hot reload)
- **Lint:** `npm run lint` (ESLint config in `eslint.config.ts`)
- **Type Check:** `npm run type-check`
- **Deploy:** Vercel config in `vercel.json`

## Project-Specific Notes
- **Type Safety:**
  - Use TypeScript types for all store state, props, and composables.
  - Table headers use the `TableHeader` type from `utils/helpers/tables.ts`.
- **File Naming:**
  - Use PascalCase for Vue components, camelCase for composables and stores.
- **Cross-Component Communication:**
  - Prefer Pinia stores and composables over event emitters for state/data flow.
- **Testing:**
  - No explicit test setup found; follow project conventions if adding tests.

## Examples
- See `src/views/system/admin/manage-payroll/trips/TripsTable.vue` for a full-featured data table with composable logic, dialogs, and store integration.
- See `src/stores/` for Pinia store patterns.
- See `src/utils/` for shared helpers and configuration.

---

For questions or unclear patterns, review the README or ask for clarification.

---

## Vue 3 + Vuetify Development Guidelines (from rules.json)

### Composition API
- ALWAYS use Composition API with `<script setup>` syntax instead of Options API
- Use `reactive()`, `ref()`, `computed()`, and `watch()` from Vue 3 composition API
- Prefer `defineProps()` and `defineEmits()` for component props and events
- Use composables (functions starting with 'use') for reusable logic
- Extract complex reactive logic into separate composable functions

### Props and Component Communication
- Define props using `defineProps()` with TypeScript interfaces for type safety
- Use prop validation with required, type, and default properties
- Emit events using `defineEmits()` instead of `$emit`
- Pass data down via props, emit events up to parent components
- Use provide/inject for deeply nested component communication
- Avoid direct mutation of props - emit events to request changes

### Reusable Techniques
- Create composables in `src/composables/` for shared reactive logic
- Use slots and scoped slots for flexible component content
- Implement render functions or dynamic components when appropriate
- Create utility functions in `src/utils/helpers/` for non-reactive logic
- Use mixins sparingly - prefer composables for Vue 3
- Implement generic components that accept configuration via props
- Use computed properties for derived state instead of methods when possible
- **Supabase Join Rule:** When fetching related table data with Supabase, ALWAYS use a single query with join syntax (e.g., `.select('*, related:foreign_key(field)')`) instead of multiple fetches. Example: For trips with units, use `.select('*, units:unit_id(name)')` to join and alias the related data.

### Vuetify Integration
- Leverage Vuetify's built-in components before creating custom ones
- Use Vuetify's theming system for consistent styling
- Utilize v-model with Vuetify form components
- Use Vuetify's grid system (`v-container`, `v-row`, `v-col`) for layouts
- Apply Vuetify's spacing and typography utilities
- Use Vuetify's icon system (`v-icon`) with Material Design Icons

### Styling and CSS Guidelines
- **NEVER write pure CSS or custom CSS classes - always use Vuetify utilities**
- Use Vuetify's built-in classes for spacing (`ma-`, `pa-`, `mt-`, `pt-`, etc.)
- Use Vuetify's color system (`primary`, `secondary`, `success`, `error`, etc.)
- Use Vuetify's typography classes (`text-h1`, `text-h2`, `text-body-1`, etc.)
- Use Vuetify's display utilities (`d-flex`, `d-none`, `d-block`, etc.)
- Use Vuetify's elevation classes (`elevation-1`, `elevation-2`, etc.)
- Use Vuetify's border utilities (`border`, `rounded`, etc.)
- Apply responsive classes (`hidden-xs-only`, `hidden-sm-and-down`, etc.)
- Use Vuetify's sizing utilities (`width`, `height`, `max-width`, etc.)
- For custom styling needs, use Vuetify's theme variables and CSS custom properties
- If absolutely necessary, use scoped styles with Vuetify theme integration

### Component Architecture
- Avoid creating new component files ask if necessary.
- Extend existing components with props and slots instead of duplicating
- Use conditional rendering (`v-if`, `v-show`) within components for variations
- Implement component variants through props rather than separate files
- Create higher-order components or wrapper components for common patterns
- Use dynamic component rendering with `<component :is='componentName'>` when needed

### State Management
- Use Pinia stores (in `src/stores/`) for global state management
- Keep component-specific state local using `ref()` or `reactive()`
- Use computed properties for derived state from stores
- Implement store actions for complex state mutations
- Use store getters for filtered or computed store data

### Code Organization
- Group related functionality within single components using logical sections
- Use TypeScript interfaces and types for better code documentation
- Implement error boundaries and proper error handling
- Use Vue 3's Teleport for modals, tooltips, and overlays
- Follow the established folder structure in `src/`
- Place reusable types in dedicated type files when shared across components

### Performance and Best Practices
- Use `v-memo` for expensive list rendering when appropriate
- Implement lazy loading with `defineAsyncComponent` for large components
- Use `shallowRef()` and `shallowReactive()` for large objects when deep reactivity isn't needed
- Implement proper key attributes for `v-for` loops
- Use `nextTick()` when DOM updates are required before further operations
- Avoid creating reactive objects in render functions


### Code Comments and Documentation
- Use Bisaya with slight English for code comments to maintain local context
- Do NOT use '//Bisaya-English comment:' as a starting comment in code.
- Example: `query sa payroll data based on itemData.id = Employee ID`, `fetch ang tanan na trip locations para sa dropdown options`
- Keep technical terms in English while using Bisaya for descriptive parts
- Use this commenting style for better team understanding and local relevance

### TypeScript Variable Definitions
- For number variables: Use `undefined` instead of `null` for undefined numeric values
- For string variables: Use empty string `''` or actual string values, avoid `null`
- Use TypeScript union types for optional values: `number | undefined` for numbers
- Use TypeScript union types for optional strings: `string | undefined` if needed
- Prefer explicit type definitions over `any` type
- Use `undefined` for uninitialized primitive values consistently
- Example: `const count: number | undefined = undefined` (not null)
- Example: `const name: string = ''` (not null)
- Example: `const optionalText: string | undefined = undefined` (when truly optional)

---

## File Creation Guidelines
- Before creating a new component file, check if existing components can be extended
- Create new files only when the component serves a completely different purpose
- Prefer adding props and conditional logic to existing components
- Use slots and dynamic content instead of creating similar components
- Create utility functions in existing helper files rather than new utility files
- Add new composables to existing composable files when related functionality exists

---

## Quick Reference Prompts for AI Agents

### Critical Project Rules
```
🚨 CRITICAL PROJECT RULES for Vue 3 + Vuetify:

1. ❌ NO PURE CSS - Only Vuetify utility classes
2. ✅ Use <script setup> - Never Options API
3. ✅ Extend existing components - Don't create new files
4. ✅ Use Vuetify spacing: ma-4, pa-2, mt-3
5. ✅ Use Vuetify colors: primary, secondary, success
6. ✅ Use Vuetify typography: text-h1, text-body-1
7. ✅ Use Vuetify layout: d-flex, justify-center, align-center
8. ✅ Use props + slots for component variations

ALWAYS follow these rules strictly!
```

### Example: Proper Vuetify Styling (NO pure CSS)
```vue
<!-- ✅ CORRECT - Using Vuetify utilities -->
<v-card class="ma-4 pa-6 elevation-2">
  <v-card-title class="text-h4 primary--text mb-3">
    {{ title }}
  </v-card-title>
  <v-card-text class="text-body-1 grey--text text--darken-2">
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" md="6" class="text-center">
        Content here
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
```
```vue
<!-- ❌ WRONG - Using pure CSS -->
<div class="custom-card">
  <h2 class="custom-title">{{ title }}</h2>
  <p class="custom-text">Content</p>
</div>
<style scoped>
.custom-card {
  margin: 16px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.custom-title {
  font-size: 24px;
  color: #1976d2;
}
</style>
```

### Example: Composition API with Props
```vue
<script setup lang="ts">
interface Props {
  title: string
  items: Array<any>
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const emit = defineEmits<{
  select: [item: any]
  close: []
}>()

const isCompact = computed(() => props.variant === 'compact')
</script>
```

### Example: Reusable Component with Props and Slots
```vue
<template>
  <v-card :class="cardClasses">
    <v-card-title v-if="title">{{ title }}</v-card-title>
    <v-card-text>
      <slot name="content">
        <slot>{{ defaultContent }}</slot>
      </slot>
    </v-card-text>
    <v-card-actions v-if="$slots.actions">
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>
```
