---

name: tech-stack
description: High-level tech stack, project structure, and core principles for visualsofdsa. Use when starting work, onboarding, or when the user asks about project structure or tech choices.
---

# Tech Stack & Structure

visualsofdsa is a single Next.js app (not a monorepo) that visualizes data structures and algorithms. Everything lives under `src/` except Prisma and config.

## Project Structure

- `src/app` → Next.js App Router: routes (`algorithms/`, `data-structures/`), `layout.tsx`, `page.tsx`, `not-found.tsx`, `sitemap.ts`, `globals.css`.
- `src/components/ui` → generic UI primitives (Radix/shadcn-style: dialog, popover, switch, button…).
- `src/components/app` → app-level pieces (nav, page header, speed/pause controls, warnings).
- `src/components/container` → layout containers for visualizations (`Section`, `RamContainer`, `HeapContainer`, `OperationsContainer`).
- `src/entities/<category>/<type>/` → one folder per algorithm or data structure. Holds pure logic (`classes/`, `_classes/`, `__classes/`), hooks (`hooks/`, `_hooks/`), components (`components/`, `_components/`), styles (`animation.css`), and tests (`__test__/`, `_test_/`, `_tests_/`).
- `src/context` → React providers (`darkModeContext`, `muteContext`).
- `src/hooks` → shared hooks (`useAnimation`, `useSpeed`, `useToast`, `useResponsive`…).
- `src/lib` → shared utilities: `metadata.ts` (`appMetadata`), `links.ts`, `utils.ts`, `animations/`, `classes/`, `errors/`, `prisma.ts` (re-export of the DB client).
- `src/prisma` → Prisma client entry (`db.ts`), `contract.prisma`, generated contract.
- `prisma/` → `migrations/`, `seed/` (`seed.ts`, `db.ts`, `utils.ts`).
- `public/` → static assets, including `robots.txt`.

## Stack

- **Next.js 16** (App Router) and **React 19**. Next 16 APIs can differ from training data: check `node_modules/next/dist/docs/` before using an API you are unsure of.
- **TypeScript** (strict). Path alias `@/` → `src/`.
- **Tailwind CSS v4**, CSS-first: theme tokens live in `src/app/globals.css` (`@theme`, `@theme inline`, `:root` / `.dark` variables).
- **Radix UI** primitives, **lucide-react** icons, **sonner** toasts, **class-variance-authority**, **clsx**, **tailwind-merge**.
- **Prisma 8** with `@prisma/orm-postgres`. The DB client is `db` from `src/prisma/db.ts` (also re-exported from `src/lib/prisma.ts`). Do not create a second client.
- **Vitest** + jsdom + Testing Library (`setupTest.ts` loads jest-dom).
- **Biome** for format and lint (`biome.json`: 2-space indent, double quotes, semicolons, trailing commas, line width 100).
- **pnpm** as package manager.

## Commands

- `pnpm dev`: dev server.
- `pnpm build`: `prisma contract emit` then `next build`.
- `pnpm biome`: check. `pnpm biome:fix`: check and write.
- `pnpm test`: Vitest in watch mode. Use `pnpm exec vitest run <pattern>` for one-shot runs.
- `pnpm db:seed`: seeds the database (`tsx prisma/seed/seed.ts`).

## Styling & UI

- **Tokens, not literals**: use the CSS variables and Tailwind aliases from `src/app/globals.css` (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-app-*`, the `shadcn` semantic colors). Avoid hardcoded hex/rgb in components.
- **Breakpoints** (`globals.css`, `min-width` queries): `phone` 480px, `tablet` 860px, `laptop` 1024px, `desktop` 1440px, `tv` 1800px.
- **Dark mode**: class-based (`.dark`), handled by `darkModeContext`. Tokens remap automatically.
- **Layout stability**: visualizations animate, so give dynamic areas fixed or reserved sizes to avoid layout shift.

## Core Principles

- **Pure logic is testable logic.** Data-structure and algorithm behaviour lives in framework-free classes; React only renders and subscribes to them.
- **Visualization first.** The animation is the product; chrome stays quiet so it reads clearly.
- **Consistency**: match the naming, folder conventions and idioms of the entity you touch.
- **No shortcuts**: fix the boundary, not the symptom. See `architecture` for import rules.
