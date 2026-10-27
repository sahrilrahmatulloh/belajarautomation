# belajarautomation.id

## Project Overview

belajarautomation.id adalah platform pembelajaran QA Automation berbahasa Indonesia.

Tujuan platform ini adalah membantu pengguna belajar Quality Assurance dan Test Automation dari level pemula hingga siap kerja melalui roadmap, materi pembelajaran, project, playground, books, dan konten edukasi.

---

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- next-themes

---

## Project Architecture

Project menggunakan pendekatan feature-based component architecture.

Struktur utama:

- `app/` — Next.js App Router, layouts, pages, dan global styles.
- `components/dashboard/` — Komponen khusus dashboard.
- `components/dashboard/cards/` — Card yang digunakan pada dashboard.
- `components/dashboard/sections/` — Section utama dashboard.
- `components/layout/` — Layout, Navbar, dan Sidebar.
- `components/learning/` — Komponen fitur pembelajaran.
- `components/roadmap/` — Komponen fitur roadmap.
- `components/books/` — Komponen fitur books.
- `components/profile/` — Komponen fitur profile.
- `components/common/` — Shared application components.
- `components/ui/` — Komponen UI dari shadcn/ui.
- `data/` — Static/mock application data.
- `types/` — Shared TypeScript types and interfaces.
- `hooks/` — Custom React hooks.
- `lib/` — Shared libraries and configuration.
- `utils/` — Utility functions.

Do not restructure or move existing folders and components unless explicitly requested.

---

## Coding Rules

- Always use TypeScript.
- Follow the existing project architecture.
- Inspect relevant existing files before making changes.
- Preserve existing naming conventions.
- Prefer small, focused, reusable components.
- Avoid unnecessary abstraction and premature refactoring.
- Do not perform large refactors unless explicitly requested.
- Do not delete existing functionality without permission.
- Do not install new dependencies unless necessary and explicitly approved.
- Explain significant architectural changes before implementing them.

---

## Component Rules

Dashboard components follow this structure:

- `cards/` contains reusable dashboard cards.
- `sections/` contains larger dashboard sections.

Feature-specific components must remain inside their respective feature folders.

Examples:

- Roadmap components belong in `components/roadmap/`.
- Learning components belong in `components/learning/`.
- Book components belong in `components/books/`.

Do not move feature-specific components into dashboard folders simply because they are displayed on the dashboard.

---

## Styling Rules

The project uses Tailwind CSS v4 and shadcn/ui design tokens.

Prefer semantic theme tokens:

- `bg-background`
- `bg-card`
- `text-foreground`
- `text-muted-foreground`
- `border-border`
- `bg-muted`
- `bg-accent`

Avoid hardcoded theme-dependent colors such as:

- `bg-white`
- `bg-black`
- `text-gray-900`
- `text-gray-500`
- `border-gray-200`

unless there is a specific design reason.

All new UI components must support both light mode and dark mode.

Prefer existing shadcn/ui components when appropriate.

Maintain the existing visual style:

- Clean
- Modern
- Minimal
- Rounded cards
- Consistent spacing
- Responsive layout

---

## Theme System

Dark mode uses:

- `next-themes`
- `ThemeProvider`
- Tailwind CSS `dark` variant
- shadcn/ui CSS variables and semantic design tokens

Do not introduce a second theme system.

Avoid manually adding `dark:` variants when an existing semantic design token can handle both themes.

---

## Development Workflow

Before modifying code:

1. Read the relevant files.
2. Understand the existing implementation.
3. Preserve the current architecture.
4. Make the smallest necessary change.
5. Check TypeScript and import consistency.
6. Verify that the change does not break existing functionality.

When asked to analyze or review code, do not modify files unless explicitly requested.

---

## Current Project Direction

Current development priorities include:

- Dashboard
- Dark mode
- Learning experience
- QA Automation roadmap
- Course categories
- Books and educational content
- Responsive design

The current dashboard includes components such as:

- Welcome Banner
- Roadmap
- Learning Progress
- Continue Learning
- Recent Activity
- Category Section

---

## Important Instructions

- Do not assume project structure. Inspect it first.
- Do not rewrite working code unnecessarily.
- Do not change architecture without explicit approval.
- Do not make unrelated changes.
- Keep changes focused on the user's current request.
- When uncertain about a significant decision, explain the options before modifying code.