# Doc Vault

Personal encrypted document vault for families — manage Aadhaar, PAN, driving license, insurance, ITR, and more across multiple people with search, travel pack, version history, and expiry reminders.

## Stack

| Layer | Tech |
|-------|------|
| Web | Next.js 15 (App Router) |
| Mobile | Expo 52 (Expo Router) |
| API | Node.js + Fastify |
| Database | PostgreSQL + Prisma |
| Infra | Docker Compose |
| Security | AES-256-GCM encryption at rest |
| OCR | Tesseract.js on upload |

## Features

- **Multi-person** — self, spouse, children, etc.
- **Document types** — Aadhaar, PAN, DL, passport, insurance, ITR, and more
- **Metadata & tags** — structured fields per document
- **Search** — title, type, person, metadata, OCR text, tags
- **Favorites & travel pack** — quick access to essentials
- **Side-by-side compare** — two documents metadata + versions
- **Versions by year** — upload yearly copies (e.g. ITR 2023, 2024)
- **Dashboard** — missing recommended docs, expiring & expired
- **Expiry reminders** — background worker (30/7/1 days before)
- **Encryption at rest** — files, metadata, OCR text encrypted
- **OCR on upload** — text extraction for search
- **Web + mobile** — full parity on core flows

## Prerequisites

- **Node.js 20+**
- **pnpm 9+** (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- **Docker Desktop** (for Postgres)
- **Expo Go** app (for mobile testing)

## Quick start

### 1. Clone & install

```bash
cd ~/Projects/doc-vault
pnpm install
```

### 2. Environment

```bash
cp .env.example .env
```

Generate a vault master key and paste into `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Set `VAULT_MASTER_KEY` and `JWT_SECRET` in `.env`.

### 3. Start Postgres

```bash
pnpm docker:up
# or: docker compose up -d postgres
```

> `pnpm docker:up` starts **Postgres only**. For the full Docker stack (API + web images), use `pnpm docker:up:all`.

### 4. Database migrate & seed

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Demo account after seed:

- **Email:** `demo@docvault.local`
- **Password:** `demo1234`

### 5. Run dev (API + Web)

```bash
pnpm dev
```

- **Web:** http://localhost:3000
- **API:** http://localhost:4000/health

### 6. Mobile (Expo)

```bash
cd apps/mobile
pnpm start
```

For a physical device, set `EXPO_PUBLIC_API_URL` in `.env` to your machine's LAN IP (e.g. `http://192.168.1.10:4000`).

## Docker (full stack)

```bash
# Set VAULT_MASTER_KEY and JWT_SECRET in .env first
pnpm docker:build
docker compose up -d
```

## Project structure

```
doc-vault/
├── apps/
│   ├── api/          # Fastify REST API
│   ├── web/          # Next.js web app
│   └── mobile/       # Expo React Native app
├── packages/
│   ├── db/           # Prisma schema + client
│   ├── shared/       # Types, Zod schemas, constants
│   └── crypto/       # AES encryption helpers
├── docker/           # Dockerfiles
└── docker-compose.yml
```

## API routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user |
| CRUD | `/persons` | Family members |
| CRUD | `/documents` | Documents |
| POST | `/documents/:id/versions` | Upload file (multipart: file, year) |
| GET | `/documents/compare?ids=a,b` | Side-by-side compare |
| PATCH | `/documents/:id/favorite` | Toggle favorite |
| PATCH | `/documents/:id/travel-pack` | Toggle travel pack |
| GET | `/search?q=` | Full-text search |
| GET | `/dashboard` | Stats, missing, expiring |
| GET | `/reminders` | Scheduled reminders |

## Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | JWT signing secret (32+ chars) |
| `VAULT_MASTER_KEY` | 32-byte base64 key for encryption |
| `API_PORT` | API port (default 4000) |
| `STORAGE_PATH` | Encrypted file storage path |
| `NEXT_PUBLIC_API_URL` | Web → API URL |
| `EXPO_PUBLIC_API_URL` | Mobile → API URL |
| `REMINDER_DAYS_BEFORE` | Comma-separated days (default 30,7,1) |

## Security notes

- Never commit `.env` or `VAULT_MASTER_KEY`.
- All uploaded files are encrypted with AES-256-GCM before disk write.
- Metadata and OCR text are encrypted in the database.
- JWT tokens expire (1h access, 7d refresh).
- Use HTTPS in production; rotate keys periodically.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start API + web in parallel |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed demo data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm docker:up` | Start Postgres (and optional full stack) |

## License

Private / personal use.
