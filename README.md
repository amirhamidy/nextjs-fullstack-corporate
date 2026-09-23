# Next.js Fullstack Corporate

A fullstack corporate website built entirely with Next.js — no separate backend, no external API. Public marketing pages, an admin panel, and a dedicated SEO management system, all powered by the same Next.js application.

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui (Base UI, Nova preset)
- **Database:** SQLite via Drizzle ORM (`@libsql/client`)
- **Forms:** React Hook Form + Zod validation
- **Package Manager:** pnpm

## Features

### Public site

- Static/ISR-rendered pages for maximum speed
- Portfolio showcase, blog, contact form
- RTL support with Persian typography (Vazirmatn)
- Dark mode

### Admin panel

- Authenticated dashboard
- Content management (portfolio, blog posts)
- Contact message inbox
- Dedicated SEO controls: meta tags, slugs, OG images, sitemap, robots.txt, redirect management

## Getting Started

```bash
pnpm install
pnpm drizzle-kit migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

src/
app/ # Routes (App Router)
components/ # UI components (shadcn/ui + custom)
db/ # Drizzle schema and database client

## Scripts

| Command                     | Description                                  |
| --------------------------- | -------------------------------------------- |
| `pnpm dev`                  | Start development server                     |
| `pnpm build`                | Build for production                         |
| `pnpm drizzle-kit generate` | Generate a new migration from schema changes |
| `pnpm drizzle-kit migrate`  | Apply migrations to the database             |
| `pnpm drizzle-kit studio`   | Open a visual database browser               |

## Status

🚧 Actively in development. This README will be updated as features are completed.

## License

This project is for portfolio purposes.
