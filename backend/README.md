# Portfolio Backend (NestJS + PostgreSQL/Drizzle)

Implements the SRS's backend requirements for the self-hosted portfolio: Profile,
Services, Projects (case files), Blog, and Contact modules, backed by PostgreSQL
via Drizzle ORM. Built to plug straight into the existing Next.js frontend template
with no frontend code changes beyond setting `NEXT_PUBLIC_API_URL`.

## 1. Setup

```bash
npm install
cp .env.example .env
# edit .env: DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, mail settings
```

## 2. Database

```bash
npm run db:generate   # (already generated once — re-run after schema changes)
npm run db:migrate    # applies drizzle/*.sql to your Postgres database
npm run db:seed       # imports ../portfolio/data/*.json + creates the admin login (optional)
```

`db:seed` reads from `../portfolio/data` by default (the frontend template's JSON
folder). Set `FRONTEND_DATA_DIR` in `.env` if your frontend lives elsewhere.

It also creates your admin login from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`
(skipped if either is unset, and safe to re-run — it won't overwrite an existing
account with the same email).

## 3. Run

```bash
npm run start:dev     # http://localhost:4000
```

Then in the **frontend**, set:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
and swap the bodies of `lib/data.ts` to `fetch()` these endpoints instead of the
local JSON imports (the comment already in that file says exactly this).

## 4. API Reference

All `GET` routes are public. Write routes (`POST`/`PATCH`/`DELETE`) and a couple of
admin-only reads require a JWT obtained by logging in:

```
POST /auth/login   Body: { "email": "...", "password": "..." }
                    -> { "accessToken": "...", "email": "..." }

Authorization: Bearer <accessToken>
```

Tokens expire after `JWT_EXPIRES_IN` (default `7d`); the frontend just sends the
person back to `/admin/login` when a request comes back `401`.

| Method | Path                  | Auth  | Notes                                         |
|--------|-----------------------|-------|------------------------------------------------|
| POST   | `/auth/login`           | –     | Rate-limited (5/min/IP). Returns a JWT        |
| GET    | `/auth/me`              | admin | Confirms the stored token is still valid      |
| GET    | `/profile`             | –     | Owner metadata                                |
| PATCH  | `/profile`              | admin | Upserts the single profile row                |
| GET    | `/services`             | –     |                                                |
| GET    | `/services/:id`         | –     |                                                |
| POST   | `/services`             | admin |                                                |
| PATCH  | `/services/:id`         | admin |                                                |
| DELETE | `/services/:id`         | admin |                                                |
| GET    | `/projects`             | –     | `?category=criminal\|research` to filter      |
| GET    | `/projects/:id`         | –     |                                                |
| POST   | `/projects`             | admin |                                                |
| PATCH  | `/projects/:id`         | admin |                                                |
| DELETE | `/projects/:id`         | admin |                                                |
| GET    | `/blog`                 | –     | Sorted newest first                           |
| GET    | `/blog/:slug`           | –     | Matches the frontend's `/blog/[slug]` route   |
| POST   | `/blog`                 | admin | Auto-generates a slug from the title if omitted |
| PATCH  | `/blog/:id`             | admin |                                                |
| DELETE | `/blog/:id`             | admin |                                                |
| POST   | `/contact`               | –     | Rate-limited (3/min/IP). Body: `sender_name`, `sender_email`, `message` |
| GET    | `/contact`               | admin | Inbox listing                                 |
| PATCH  | `/contact/:id/read`      | admin | Marks a message read                          |

## 5. Security & reliability (NFR coverage)

- **NFR-04** IP-based rate limiting via `@nestjs/throttler`: a global baseline plus a
  tighter override (3 requests/minute) on `POST /contact`.
- **NFR-05** All input validated & sanitized via `class-validator` DTOs and a global
  `ValidationPipe` with `whitelist` + `forbidNonWhitelisted` (unknown fields are rejected,
  not silently accepted).
- **NFR-06** `helmet()` sets standard security headers; put TLS termination at your
  host/reverse proxy (Vercel/Render/Railway do this automatically) so all traffic is HTTPS.
- Admin routes are protected by a JWT issued on login (`POST /auth/login`), verified by
  `AdminGuard`. Passwords are hashed with bcrypt (`bcryptjs`) and never stored in plain
  text; login is rate-limited (5/min/IP) and returns a generic error for both a wrong
  password and an unknown email, to avoid leaking which admin accounts exist. Designed
  for a single owner (one row in `admins`) but nothing stops you from seeding more.

## 6. Contact form email delivery (FR-05)

`MailService` sends via **either**:
- SMTP (`SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS`) using Nodemailer, or
- **Resend** (`RESEND_API_KEY`) over HTTP, if set — takes priority over SMTP.

Every submitted message is saved to `contact_messages` first, so even if the outbound
email fails (bad credentials, provider outage), no inquiry is lost — check `GET /contact`
as a fallback inbox.

## 7. Deployment (NFR-07)

Works on Render/Railway (Node process) or a small VPS, paired with a managed Postgres
(Neon/Supabase). Set the env vars from `.env.example`, run `npm run db:migrate` once,
then `npm run build && npm run start:prod`.
