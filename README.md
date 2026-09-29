# eventza

An event ticketing platform. Organizers can create and sell tickets, attendees can browse and purchase them, and staff can check people in at the door with a QR scanner.

## What's in here

Three apps in a monorepo:

- **`apps/api`** — REST API (Express + PostgreSQL)
- **`apps/web`** — main web app (Next.js)
- **`apps/scanner`** — QR check-in app for event staff (Next.js)
- **`packages/shared`** — shared TypeScript types

## Features

- Email/password auth + passwordless login via OTP email
- JWT access tokens with refresh token rotation
- Create events with categories, location, images (stored on S3)
- Buy tickets — Stripe handles payments (payment intents + webhooks)
- QR codes generated per order for check-in
- Staff log into the scanner app and scan QR codes to mark attendees as checked in
- Organizer dashboard with charts (sales, attendance)
- Dark mode

## Stack

| Layer | Tech |
|---|---|
| API | Express 5, TypeScript, Sequelize, PostgreSQL |
| Auth | Argon2, JWT, OTP via Resend |
| Payments | Stripe |
| Storage | AWS S3 (via multer) |
| Validation | Zod |
| Web / Scanner | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Data fetching | TanStack Query |
| Forms | React Hook Form + Zod |
| Monorepo | Turborepo + pnpm workspaces |

## Setup

### Prerequisites

- Node.js 20+
- pnpm (`npm i -g pnpm`)
- PostgreSQL database
- Stripe account
- AWS S3 bucket
- SMTP credentials (for sending OTP emails)

### Install

```bash
pnpm install
```

### Environment variables

Each app ships a `.env.example` listing every key it reads. Copy it and fill in
the values:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/scanner/.env.example apps/scanner/.env
```

**`apps/api/.env`**

```env
# Database (Postgres). SSL is required — see src/config/database.ts
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=

# Auth
USER_ACCESS_TOKEN_SECRET=
USER_REFRESH_TOKEN_SECRET=
SCANNER_ACCESS_TOKEN_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=

# Image uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Payments (Stripe)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# CORS / links back to the web app
FRONTEND_URL=
```

The API refuses to start if any of the five `DB_` values are missing.

**`apps/web/.env`**

```env
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SCANNER_URL=http://localhost:3002
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

**`apps/scanner/.env`**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Database

Run migrations from the `apps/api` directory:

```bash
cd apps/api
pnpm migrate
```

### Dev

From the root — starts all three apps in parallel:

```bash
pnpm dev
```

Or run them individually:

```bash
pnpm dev:api   # API on :3001
pnpm dev:web   # Web on :3000
```

The scanner app runs on `:3002` when started directly from `apps/scanner`.

### Build

```bash
pnpm build
```
