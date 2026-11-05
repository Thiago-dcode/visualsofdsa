---

name: architecture
description: Layer boundaries, folder responsibilities, and import rules for the visualsofdsa Next.js app. Use when adding imports, creating new entities or components, moving code between folders, or when the user asks about dependency direction.
---

# Architecture Boundaries (STRICT)

Single Next.js app. Boundaries are folder-based. Dependency direction flows one way:

```
src/app  →  src/components  →  src/entities  →  src/lib
                 ↑                   ↑
            src/context, src/hooks  (used by components and entities, never import from app)
```

Lower layers never import from higher ones. `src/lib` imports nothing from the app layers.

## src/app (routes)

- Route files stay thin: compose components, read data through entity services, and build metadata with `appMetadata` from `src/lib/metadata.ts`.
- No algorithm or data-structure logic in route files.
- `sitemap.ts` is `force-dynamic` and only queries the database in production. Keep that behaviour when editing it.

## src/entities (domain)

- One folder per algorithm or data structure. Keep the existing sub-folder names (`classes`/`_classes`/`__classes`, `hooks`/`_hooks`, `components`/`_components`, `__test__`/`_test_`/`_tests_`). Match the sibling entity you are copying from.
- **Classes are framework-free**: no React, no Next, no DOM, no DB imports. They are the logic the tests cover.
- **Hooks** may use React state and effects. They do not query the database.
- **Services** that read the database (e.g. `AlgorithmService`, `DataStructureService` in `__classes`) are server-side. Only server code imports `@/lib/prisma`. A client component must never import it.
- Entities may import from `src/lib`, `src/components/ui`, `src/hooks` and `src/context`. They must not import from `src/app`.

## src/components

- **`ui/`**: presentational primitives only. No domain logic, no DB access, no env access, no entity imports. Check whether a primitive exists before creating one.
- **`app/`** and **`container/`**: compose `ui` primitives and entity components. They may hold view state. No DB access.

## src/context and src/hooks

- Context providers and their consumers are client code. Put `'use client'` only where the component needs state, effects or browser APIs.
- Shared hooks here are generic (speed, responsive, toast, on-screen). Domain-specific hooks go in the entity.

## src/lib

- Framework-agnostic utilities. No React components.
- `lib/prisma.ts` re-exports the single DB client. Import from it, don't instantiate another.
- `lib/metadata.ts` owns the title suffix and default SEO copy. Change them there, not per page.

## prisma/ and src/prisma

- `src/prisma/db.ts` is the database entry point. Schema, migrations and seed live in `prisma/`.
- Seed code (`prisma/seed/`) runs under `tsx` outside Next. It must not import Next-only modules.

## Import rules

- Use the `@/` alias for anything under `src/`. Avoid deep relative paths that cross entity folders.
- Import types with `import type` when the value is only used as a type.
- Never import a `src/entities/*` module into another entity's `classes/`. Share through `src/lib` or a hook.
