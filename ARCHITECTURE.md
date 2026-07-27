# Architecture Guide

This document describes the project's architecture, organization, and development conventions.

The project follows a **feature-first architecture** designed around **business capabilities**. The goal is to keep related code together, minimize unnecessary abstractions, and make features easy to evolve over time.

When in doubt, optimize for **simplicity**, **locality**, and **explicitness** over abstraction.

---

# Core Principles

Before introducing new abstractions, keep code as close as possible to the feature that owns it.

- Organize code by **business capability**, not technology.
- Keep related code together.
- Prefer composition over shared abstractions.
- Promote code only after it demonstrates real reuse.
- Favor explicit, readable code over clever abstractions.

---

# Project Structure

The project is organized into four layers. Each layer has a clear responsibility.

```text
project/
├── app/              # Routes, layouts, page composition
├── features/         # Product capabilities and business logic
├── integrations/     # Third-party libraries, SDKs, infrastructure
└── core/             # Generic reusable building blocks
```

Features **may depend on other features**, but top-level feature dependencies must form a **directed acyclic graph (DAG)**.

| From             | Can import                             |
| ---------------- | -------------------------------------- |
| `app`            | `features/`, `integrations/`, `core/`  |
| `features/*`     | `features/*`, `integrations/`, `core/` |
| `integrations/*` | `core/`                                |
| `core/`          |                                        |

Keep dependencies flowing in one direction to prevent circular dependencies.

```text
feature-a
    ↓
feature-b
    ↓
feature-c
```

This dependency hierarchy is enforced by the Prettier import ordering configuration (see Tooling Conventions below).

---

# Features

A feature represents a **cohesive area of the application**, not how URLs are structured.

```text
auth/
users/
organization/
content/
billing/
```

As features grow, split them into smaller submodules.

```text
features/
└── users/
    ├── accounts/
    ├── roles/
    ├── permissions/
    └── access-control/
```

Submodules within the same feature may depend on one another freely.

## Feature structure

Each feature follows a consistent internal structure. Only create directories that provide value — not every directory is needed in every feature.

```text
feature/
├── components/
│   ├── {feature}-view.tsx          ← Orchestrator (the main export consumed by pages)
│   ├── {sub-feature}/              ← Domain-grouped sub-folders
│   │   └── {feature}-{component}.tsx
│   └── ...
├── lib/
│   ├── {feature}.schema.ts         ← Zod schemas and inferred types
│   ├── {feature}.api.ts            ← Raw fetch / data-access functions
│   └── {feature}.queries.ts        ← TanStack Query keys + queryOptions() factories
├── utils/                          ← Optional (present only in pokedex)
│   ├── {feature}.{domain}.ts       ← Domain-specific pure utilities
│   └── ...
├── hooks/
├── providers/
└── styles/
```

### What goes where

| Directory     | When to create                                                               | Examples                                     |
| ------------- | ---------------------------------------------------------------------------- | -------------------------------------------- |
| `components/` | Every feature has a UI.                                                      | `pokemon-view.tsx`, `todo-item.tsx`          |
| `lib/`        | When the feature has data. Minimum: `{feature}.schema.ts`.                   | `pokemon.schema.ts`, `pokemon.api.ts`        |
| `utils/`      | When pure functions outgrow inline helpers.                                  | `pokemon.format.ts`, `pokemon.pagination.ts` |
| `hooks/`      | When a custom hook is reused across multiple components in the same feature. | keep inline until reuse is proven.           |
| `providers/`  | When state must be shared across components via React Context.               | prefer local state or TanStack Query cache.  |
| `styles/`     | When a feature needs its own CSS modules or Tailwind compositions.           |                                              |

### Query keys and options

TanStack Query keys and `queryOptions()` factories are co-located in `{feature}.queries.ts` — can be split across separate `*.keys.ts` and `*.options.ts` files.

```ts
// features/pokedex/lib/pokemon.queries.ts
import { queryOptions } from "@tanstack/react-query"

import { fetchPokemon } from "@/features/pokedex/lib/pokemon.api"

export const fetchPokemonKey = ["pokemon", "detail"] as const

export function fetchPokemonOptions({ nameOrId }: { nameOrId: string }) {
  return queryOptions({
    queryKey: [...fetchPokemonKey, nameOrId],
    queryFn: () => fetchPokemon(nameOrId),
    enabled: nameOrId.length > 0,
  })
}
```

If a feature grows large enough that splitting keys and options into separate files becomes valuable, introduce `*.keys.ts` and `*.options.ts` as needed. Start combined and split only when the combined file becomes unwieldy.

## Component organization

### Orchestrator pattern

Every feature exposes a **single view component** as its main entry point. Pages import only this component.

```text
{feature}-view.tsx          ← The orchestrator. Owns composition and data flow.
├── detail/
│   └── {feature}-detail-view.tsx
├── list/
│   ├── {feature}-list.tsx
│   └── {feature}-item.tsx
└── search/
    ├── {feature}-search-card.tsx
    └── {feature}-search-result.tsx
```

```ts
// app/(site)/(pokemon)/page.tsx — the page is thin
import { PokemonView } from "@/features/pokedex/components/pokemon-view"

export default function HomePage() {
  return (
    <>
      <h1>Pokédex</h1>
      <PokemonView />
    </>
  )
}
```

The orchestrator (`PokemonView`) composes sub-feature components (`PokemonSearchCard`, `PokemonList`, etc.) and manages state flow between them. Pages only provide the route-level shell (heading, metadata).

### Naming convention for components

| Role                 | Naming pattern            | Example                                     |
| -------------------- | ------------------------- | ------------------------------------------- |
| Feature orchestrator | `<{Feature}View>`         | `PokemonView`, `TodoView`                   |
| Page-level wrapper   | `<{Feature}DetailView>`   | `PokemonDetailView`                         |
| List container       | `<{Feature}List>`         | `PokemonList`                               |
| List item            | `<{Feature}Item>`         | `PokemonItem`, `TodoItem`                   |
| Form / card          | `<{Feature}{Descriptor}>` | `PokemonSearchCard`, `PokemonDetailCard`    |
| Page component       | `<{Context}Page>`         | `HomePage`, `TodoPage`, `PokemonDetailPage` |
| Layout component     | `<{Context}Layout>`       | `RootLayout`, `SiteLayout`                  |

## Minimal feature example

Not every feature needs all directories. A simple feature may only need `components/` and `lib/`:

```text
todo/
├── components/
│   ├── todo-view.tsx
│   └── list/
│       ├── todo-list.tsx
│       └── todo-item.tsx
└── lib/
    └── todo.schema.ts
```

Start minimal. Add directories only when the code demands them.

---

# Integrations

The `integrations/` layer contains wrappers around third-party libraries and infrastructure. They should never contain business logic.

```text
integrations/
└── tanstack/
    └── query/
        └── provider.tsx
```

Integrations own:

- SDK configuration
- Provider components
- Library wrappers
- Infrastructure setup

## Provider pattern

Integration providers are thin wrappers that configure a third-party library and export a component for use in the root layout.

```tsx
// integrations/tanstack/query/provider.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, refetchOnWindowFocus: false },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient()
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

Key patterns:

- **SSR-safe singleton**: Create a fresh `QueryClient` per server request, reuse a single instance on the client to avoid hydration mismatches.
- **Default options**: Set sensible defaults (`staleTime: 60_000`, `refetchOnWindowFocus: false`) at the provider level so individual queries don't need to repeat them.
- **Providers compose at the root**: The root `app/layout.tsx` wraps children with all integration providers.

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TanstackQueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
```

---

# Core

Everything inside `core` should remain reusable without knowledge of the application's business domain.

If a module understands users, organizations, permissions, billing, content, or other business concepts, it belongs inside a feature.

```text
core/
├── components/
│   ├── reui/          ← Premium ReUI blocks (installed from registry)
│   └── ui/            ← shadcn/ui primitives (installed from registry)
├── hooks/
│   ├── use-file-upload.ts
│   └── use-mobile.ts
├── lib/
│   └── utils.ts       ← cn() — clsx + tailwind-merge
└── style/
    └── globals.css
```

Directories like `constants/`, `types/`, `providers/`, and `layouts/` are available if needed but currently unused. Create them only when a genuinely generic building block emerges.

## Core hooks

Core hooks are generic, reusable hooks with no knowledge of business domains.

```ts
// core/hooks/use-mobile.ts
export function useIsMobile() {
  // Uses useSyncExternalStore for SSR-safe window.matchMedia subscription
}
```

Patterns:

- **SSR-safe browser APIs**: Use `useSyncExternalStore` (not `useEffect` + `useState`) for subscriptions to browser APIs like `matchMedia`. This avoids hydration mismatches.
- **Tuple return**: Complex hooks return `[state, actions]` tuples (like `useState`) rather than objects. The consumer destructures what it needs.
- **File naming**: `use-{name}.ts` for the file, `use{PascalCase}()` for the function.

---

# File Naming Conventions

All files use **kebab-case dot-notation**: `{feature}.{kind}.{ext}` for data-layer files and `{feature}-{descriptor}.{ext}` for components.

| Category              | Pattern                      | Examples                                                       |
| --------------------- | ---------------------------- | -------------------------------------------------------------- |
| Feature folders       | `kebab-case`                 | `pokedex/`, `todo/`                                            |
| Sub-feature folders   | `kebab-case`                 | `detail/`, `list/`, `search/`                                  |
| Components            | `{feature}-{descriptor}.tsx` | `pokemon-view.tsx`, `pokemon-detail-card.tsx`, `todo-item.tsx` |
| Schemas               | `{feature}.schema.ts`        | `pokemon.schema.ts`, `todo.schema.ts`                          |
| API functions         | `{feature}.api.ts`           | `pokemon.api.ts`                                               |
| Query definitions     | `{feature}.queries.ts`       | `pokemon.queries.ts`                                           |
| Utilities             | `{feature}.{domain}.ts`      | `pokemon.format.ts`, `pokemon.pagination.ts`, `pokemon.url.ts` |
| Core hooks            | `use-{name}.ts`              | `use-file-upload.ts`, `use-mobile.ts`                          |
| Integration providers | `provider.tsx`               | `integrations/tanstack/query/provider.tsx`                     |

---

# General Conventions

## Imports & Exports

Import modules directly from the file that defines them.

Do not create barrel files or export aggregators solely to shorten import paths. This includes `index.ts`, `exports.ts`, or any file whose primary purpose is to re-export other modules.

```ts
// Avoid
import { Button } from "@/core/components"
import { UserForm } from "@/features/users/components"

// Prefer
import { UserForm } from "@/features/users/components/user-form"
import { Button } from "@/core/components/ui/button"
```

Use inline type imports for type-only imports.

```ts
import { use, type ReactNode } from "react"

import type { Pokemon } from "@/features/pokedex/lib/pokemon.schema"
```

This is enforced by the ESLint rule `@typescript-eslint/consistent-type-imports` with `fixStyle: "inline-type-imports"`.

## Import ordering

Imports are automatically sorted by Prettier into groups that mirror the architectural layering:

```text
1. next, next/*, react, react/*        ← Frameworks
2. Node built-ins, third-party packages  ← External dependencies
3. @/app/*                               ← App layer
4. @/features/*                          ← Feature layer
5. @/integrations/*                      ← Integration layer
6. @/core/*                              ← Core layer
7. Other @/*                             ← Remaining internal aliases
8. Relative imports (../../, ../, ./)   ← Co-located modules
9. CSS files                             ← Stylesheets
```

This ordering makes dependency direction violations visible during code review.

## Directories

- Use `kebab-case`.
- Prefer descriptive names over abbreviations.

## Types & Validation

Zod is the **single source of truth** for all data shapes. Every schema lives in its feature's `lib/{feature}.schema.ts` file and is the authoritative definition of what data looks like.

### Schema-first workflow

1. Define the shape with a **Zod schema** (`z.object({ … })`).
2. Export the **runtime validator** (`export const pokemonSchema = …`).
3. Export the **inferred TypeScript type** using `z.infer` (`export type Pokemon = z.infer<typeof pokemonSchema>`).
4. Use the **type** everywhere else. Never reach for the schema when you only need the type.

```ts
// features/pokedex/lib/pokemon.schema.ts
import { z } from "zod"

// 1. Runtime validator (for parsing, validation, form resolvers)
export const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
})

// 2. Inferred type (for annotations, props, generics)
export type Pokemon = z.infer<typeof pokemonSchema>
```

### Where `z.infer` lives

`z.infer<typeof …>` calls **only appear inside schema files** — never inline at usage sites. Every inferred type gets a named export so consumers import a clean type alias.

```ts
// ✅ Do: export the inferred type from the schema file
// pokemon.schema.ts
export type Pokemon = z.infer<typeof pokemonSchema>

// ✅ Do: import the type alias everywhere else
// pokemon-detail-card.tsx
import type { Pokemon } from "@/features/pokedex/lib/pokemon.schema"

// ❌ Don't: infer inline at the usage site
// pokemon-detail-card.tsx
import { pokemonSchema } from "@/features/pokedex/lib/pokemon.schema"
type Pokemon = z.infer<typeof pokemonSchema> // ← don't do this
```

### How types flow through layers

Types propagate through the feature layers without duplication:

```
Schema layer (pokemon.schema.ts)
  └─ z.object → z.infer → export type Pokemon
       │
       ▼
API layer (pokemon.api.ts)
  └─ import type { Pokemon } from "./pokemon.schema"
  └─ function fetchPokemon(): Promise<Pokemon>
       │
       ▼
Query layer (pokemon.queries.ts)
  └─ imports fetchPokemon (not the type)
  └─ queryOptions infers the return type from queryFn
       │                        (no explicit type annotation needed)
       ▼
Component layer (*.tsx)
  └─ import type { Pokemon } from "./pokemon.schema"
  └─ used for props, state, and display
```

Key points:

- **Schema files** own both the validator and the type.
- **API files** import the type and annotate return values explicitly (`Promise<Pokemon>`).
- **Query files** do not import schema types — TypeScript infers them from the API function's return type through `queryOptions`.
- **Components** import the type directly from the schema file for prop typing and rendering.

### Deriving narrower types

Use `Pick`, `Omit`, and other utility types to derive narrower types from the inferred ones — not separate Zod schemas.

```ts
// pokemon.schema.ts
export type Pokemon = z.infer<typeof pokemonSchema>

// Derived from the inferred type, not from a new Zod schema
export type PokemonListItem = Pick<Pokemon, "id" | "name">
```

When you need a subset for a list view, `Pick` from the full type. Only create a separate Zod schema if you need runtime validation of the subset (e.g., validating an API response for a list endpoint).

### Form inputs vs domain types

Form input schemas (for `react-hook-form` + `@hookform/resolvers/zod`) are separate from domain schemas. They live in the same schema file alongside the domain types.

```ts
// todo.schema.ts
// Domain type — what a Todo IS
export const todoSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  createdAt: z.number(),
})
export type Todo = z.infer<typeof todoSchema>

// Form input type — what the user SUBMITS to create a Todo
export const addTodoSchema = z.object({
  text: z.string().min(1).max(200).transform(v => v.trim()),
})
export type AddTodoInput = z.infer<typeof addTodoSchema>
```

### React props

React prop types are defined **inline** — no named `interface FooProps` or `type FooProps` declarations.

```tsx
// ✅ Do: inline props
export function PokemonDetailCard({ pokemon }: { pokemon: Pokemon }) {
  return <div>{pokemon.name}</div>
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return <div>{todo.text}</div>
}

// ❌ Avoid: named prop types
interface PokemonDetailCardProps {
  pokemon: Pokemon
}
export function PokemonDetailCard({ pokemon }: PokemonDetailCardProps) { … }
```

### `type` vs `interface`

In this codebase, all domain types are derived from Zod via `type` aliases. There are **no `interface` declarations** in `features/` or `app/`.

Use `type` for:

- Zod-inferred type aliases (`type Pokemon = z.infer<typeof pokemonSchema>`)
- Derived types (`type PokemonListItem = Pick<Pokemon, "id" | "name">`)
- Unions, intersections, conditional types, mapped types

Use `interface` only for genuinely object-shaped types in `core/` that are not derived from Zod — for example, if a generic core component needs a well-known props interface.

## Class merging

Use `cn()` from `@/core/lib/utils` for all Tailwind class concatenation and conflict resolution. Never use template literals or manual string concatenation for Tailwind classes.

```ts
import { cn } from "@/core/lib/utils"

// Prefer
<div className={cn("text-sm", isActive && "underline")} />

// Avoid
<div className={`text-sm ${isActive ? "underline" : ""}`} />
```

## Environment variables

Use `@/env` for all environment variable access. Never use `process.env` directly — this is enforced by an ESLint `no-restricted-properties` rule.

```ts
// env.ts
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // Server-only vars (available only in Node.js)
    // DATABASE_URL: z.string().url(),
  },
  client: {
    // Client vars (must be prefixed with NEXT_PUBLIC_)
    // NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    // NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  emptyStringAsUndefined: true,
})
```

```ts
// In any module — NEVER process.env directly
import { env } from "@/env"
```

---

# Next.js & React Conventions

## Server components as default

All `page.tsx` and `layout.tsx` files are server components by default. Only add `"use client"` when the component uses hooks, event handlers, or browser APIs.

## Unwrapping params with `use()`

In Next.js 15+, route params are a Promise. Use React's `use()` to unwrap them in server components.

```tsx
// app/(site)/pokemon/[id]/page.tsx
import { use } from "react"

export default function PokemonDetailPage(props: PageProps<"/pokemon/[id]">) {
  const { id } = use(props.params)
  return <PokemonDetailView id={id} />
}
```

## Typed route params

Use `PageProps<"path/[param]">` for type-safe access to route parameters. This requires `typedRoutes: true` in `next.config.ts`.

## Route groups

Use route groups (`(groupName)`) to nest layouts without adding URL segments.

```text
app/
├── (site)/               ← Layout group: provides the site shell (nav, max-width)
│   ├── layout.tsx
│   ├── (pokemon)/        ← Nested group: the home page, route = /
│   │   └── page.tsx
│   ├── pokemon/
│   │   └── [id]/
│   │       └── page.tsx   ← Route = /pokemon/:id
│   └── todo/
│       └── page.tsx       ← Route = /todo
```

## React Compiler

The React Compiler is enabled (`reactCompiler: true` in `next.config.ts`). It automatically applies memoization and other optimizations. The ESLint plugin `eslint-plugin-react-compiler` warns when code can't be optimized.

## Image optimization

Configure remote image hostnames in `next.config.ts` under `images.remotePatterns`. Use `next/image` for all optimized images.

---

# Quick Reference

## Adding a new feature

1. Create the feature folder under `features/{feature-name}/`.
2. Add `components/{feature-name}-view.tsx` — the orchestrator.
3. Add `lib/{feature-name}.schema.ts` — Zod schemas.
4. If the feature fetches data: add `lib/{feature-name}.api.ts` and `lib/{feature-name}.queries.ts`.
5. Create a page in `app/` that imports the view component.
6. Add the route to the site layout navigation if needed.
7. Only create `hooks/`, `utils/`, `providers/`, or `styles/` when the code demands them.

## Adding a new integration

1. Create the integration folder under `integrations/{name}/`.
2. Add a `provider.tsx` that wraps the third-party library.
3. Export the provider component.
4. Compose the provider in `app/layout.tsx`.

---

# Tooling Conventions

## TypeScript

- `strict: true` — full strict mode enabled.
- `moduleResolution: "bundler"` — bundler-style module resolution.
- Path alias `@/*` maps to the project root.

## ESLint

Key enforced rules beyond the standard presets:

| Rule                                         | Purpose                                              |
| -------------------------------------------- | ---------------------------------------------------- |
| `curly: "error"` + `"all"`                   | Always use braces, even for single-statement blocks. |
| `no-duplicate-imports: "error"`              | Each module imported at most once.                   |
| `prefer-const: "error"`                      | Use `const` unless reassignment is needed.           |
| `object-shorthand: "error"`                  | Use `{ name }` not `{ name: name }`.                 |
| `no-restricted-properties`                   | Bans `process.env` — use `@/env` instead.            |
| `@typescript-eslint/consistent-type-imports` | Enforces inline type imports (`import type { X }`).  |

Generated/registry code in `core/components/ui/**` and `core/components/reui/**` has relaxed rules (no `any` warnings, no React Compiler warnings).

## Prettier

- `semi: false` — no semicolons.
- `singleQuote: false` — double quotes.
- `printWidth: 100`.
- `arrowParens: "avoid"` — omit parens for single-parameter arrow functions.
- Import ordering plugins: `@ianvs/prettier-plugin-sort-imports` + `prettier-plugin-tailwindcss`.

## Package manager

- **pnpm** with a single-package workspace (`pnpm-workspace.yaml`).
- Scripts: `dev`, `build`, `start`, `typecheck` (`tsc --noEmit`), `lint` (`eslint`), `format` (`prettier --write .`), `check` (`typecheck && lint`).
