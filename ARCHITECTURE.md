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
app/              # Routes, layouts, page composition
features/         # Product capabilities and business logic
integrations/     # Third-party libraries, SDKs, infrastructure
core/             # Generic reusable building blocks
```

Features **may depend on other features**, but top-level feature dependencies must form a **directed acyclic graph (DAG)**.

| From             | Can import                             |
| ---------------- | -------------------------------------- |
| `app/`           | `features/`, `integrations/`, `core/`  |
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

---

# Integrations

The `integrations/` layer contains wrappers around third-party libraries and infrastructure. They should never contain business logic.

```text
integrations/
├── tanstack/
│   └── query/
├── vercel/
│   └── ai/
├── resend/
├── react-email/
└── livekit/
```

Integrations own:

- SDK configuration
- Providers
- Library wrappers
- Infrastructure

---

# Core

Everything inside `core` should remain reusable without knowledge of the application's business domain.

If a module understands users, organizations, permissions, billing, content, or other business concepts, it belongs inside a feature.

```text
core/
├── components/
│   ├── reui/
│   └── ui/
├── constants/
├── hooks/
├── layouts/
├── lib/
├── providers/
├── styles/
├── types/
└── utils/
```

---

# Module Structure

Modules should follow a similar structure whenever it makes sense. Only create directories that provide value. Keep code inside the owning module until reuse is proven.

```text
module/
├── components/
├── hooks/
├── lib/
│   ├── *.constants.ts # Module-specific constants
│   ├── *.keys.ts      # TanStack Query keys
│   ├── *.options.ts   # Shared `queryOptions()` factories
│   ├── *.mutations.ts # Mutation functions
│   ├── *.queries.ts   # Query functions
│   └── *.schema.ts    # Zod schemas
├── providers/
├── styles/
└── utils/
```

Do not promote code simply because it is imported multiple times. Code belongs in `core` only when it becomes a genuinely generic building block.

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
import { Button } from "@/core/components/button"
import { UserForm } from "@/features/users/components/user-form"
```

## Directories

- Use `kebab-case`.
- Prefer descriptive names over abbreviations.

## TypeScript

Use `interface` for object shapes.

Use `type` for:

- Unions
- Intersections
- Conditional types
- Mapped types
- Utility types

```ts
interface User {
  id: string
  name: string
}
```

```ts
type Status = "idle" | "loading" | "error"
```
