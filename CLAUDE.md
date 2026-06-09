# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Wassoh Farm** is a mobile-first financial management web app for an agricultural project. It tracks income and expenses in GNF (Franc guinéen). The entire UI is in French.

## Tech Stack

- **Framework**: Nuxt 3 (SPA mode — SSR disabled)
- **UI**: Tailwind CSS + shadcn-vue (or NuxtUI)
- **Backend**: Nuxt server routes (`server/api/`)
- **Database**: PostgreSQL via Drizzle ORM
- **Validation**: Zod (both client and server side)
- **Auth**: Simple PIN or email/password (no OAuth)

## Commands

```bash
# Install dependencies
npm install

# Dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run database migrations
npx drizzle-kit push

# Generate migration files
npx drizzle-kit generate

# Open Drizzle Studio (DB GUI)
npx drizzle-kit studio
```

## Architecture

### Directory Structure (Nuxt 3 conventions)

- `pages/` — File-based routing. Key pages: dashboard (`index.vue`), transactions list, add/edit transaction, reports
- `components/` — Reusable Vue components (transaction cards, forms, charts, layout elements)
- `composables/` — Shared reactive logic (e.g., `useTransactions`, `useFormatCurrency`)
- `server/api/` — Backend API routes (CRUD for transactions, summary/stats endpoints)
- `server/db/` — Drizzle schema definitions and database connection
- `utils/` — Shared utilities (currency formatting, category lists, Zod schemas)
- `layouts/` — App layout with header ("Wassoh Farm") and navigation
- `public/` — Static assets including favicon

### Data Model

Single `transactions` table with fields: `id`, `type` (income/expense), `amount` (DECIMAL 12,2), `label`, `category`, `note`, `date`, `created_at`, `updated_at`.

### Categories (hardcoded)

**Income** (`income`): Vente de récolte, Subvention, Prêt reçu, Autre revenu
**Expense** (`expense`): Semences, Engrais/pesticides, Main d'œuvre, Matériel, Transport, Eau/irrigation, Autre dépense

### Key Patterns

- **Currency display**: All amounts formatted with thousands separators and "GNF" suffix (e.g., `5 000 000 GNF`). Use a shared `formatCurrency` utility.
- **Validation**: Zod schemas shared between client (`pages/`, `components/`) and server (`server/api/`) for transaction forms.
- **API design**: RESTful Nuxt server routes under `server/api/transactions/`. Dashboard summary data served from a dedicated stats endpoint.
- **Mobile-first**: Design for 390px width minimum. Maximum 3 visible actions per screen. Floating action button for quick transaction entry.
- **Color palette**: Green/earth tones for the agricultural theme. Green for income amounts, red for expense amounts.
