# Bishop Carroll Class of 2006 — Reunion Website

A private reunion website for the Bishop Carroll High School Class of 2006. Built with Next.js and deployed on Cloudflare Workers.

## Features

- **Password protection** — site requires the graduation year to enter; auth is enforced server-side via an HttpOnly cookie
- **Countdown timer** — live countdown to the reunion date (September 26, 2026)
- **RSVP form** — classmates can RSVP and their status appears as a badge on their yearbook photo
- **Yearbook photos** — full class grid with progressive loading, RSVP badges, and a lightbox viewer
- **Class photo album** — classmates can upload memories for review; approved photos display in a slideshow
- **Payment hub** — Venmo and PayPal links for reunion fees
- **In Memoriam** — section honoring classmates we've lost
- **Nostalgia section** — time capsule of what we were all doing in 2006
- **Admin panel** — password-protected page to approve/reject uploaded photos

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 4 |
| Deployment | Cloudflare Workers via OpenNext |
| Database | Cloudflare D1 (SQLite) |
| File storage | Cloudflare R2 |
| Language | TypeScript |

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Enter `2006` at the password screen.

> **Note:** D1 and R2 bindings are not available in `next dev`. Use `npm run preview` to test with real Cloudflare bindings locally via Wrangler.

```bash
npm run preview
```

## Deployment

Deploys automatically via Cloudflare Pages on push to `main`. To deploy manually:

```bash
npm run deploy
```

## Cloudflare Dashboard Requirements

The following bindings must be configured in the Cloudflare dashboard for the Worker to function:

| Binding | Type | Name |
|---|---|---|
| `DB` | D1 Database | `reunion-db` |
| `BUCKET` | R2 Bucket | `reunion-photos` |

The R2 bucket should have **public access disabled**. Photos are served through the Worker proxy at `/api/photos/[filename]`, which requires a valid session cookie.

## Privacy & Security

- The site is blocked from search engine indexing via `robots.txt` and `noindex` meta tags
- Yearbook photos are protected by Next.js middleware — unauthenticated requests receive a 401
- Uploaded photos in R2 are served only through an authenticated Worker proxy
- Session cookies are HttpOnly and cannot be accessed by JavaScript

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/     # POST — validates password, sets session cookie
│   │   │   └── check/     # GET  — verifies session cookie is present
│   │   ├── photos/        # GET list / POST upload / GET [filename] proxy
│   │   ├── admin/photos/  # Admin photo approval
│   │   ├── attendees/     # RSVP list (used for yearbook badges)
│   │   └── rsvp/          # RSVP submission
│   ├── admin/             # Admin page
│   └── page.tsx           # Main site
├── components/
│   ├── PasswordProtection.tsx
│   ├── YearbookSection.tsx
│   ├── PhotoAlbum.tsx
│   ├── PhotoBackground.tsx
│   ├── Hero.tsx
│   ├── Countdown.tsx
│   ├── RSVPForm.tsx
│   ├── Navbar.tsx
│   ├── GraduationVideo.tsx
│   └── NostalgiaSection.tsx
└── middleware.ts           # Protects /photos/yearbook-photos/* paths
```

## Admin Access

Visit `/admin` and enter the admin key when prompted. The admin panel allows approving or rejecting uploaded photos before they appear on the site.
