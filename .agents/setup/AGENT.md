# AGENT.md — Panduan untuk AI Coding Agent

## Project Overview
**Partner Flow** — Platform referral mitra untuk distribusi. Next.js 15 + Tailwind v4 + shadcn/ui.

## Tech Stack
- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`, NO tailwind.config.js)
- **UI**: shadcn/ui (New York, neutral base)
- **Icons**: Lucide React + React Icons
- **Package Manager**: Bun
- **Font**: Geist (next/font/google)
- **Animations**: tailwind-animate-css, motion (framer-motion)

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css         # Tailwind v4 + CSS variables (light/dark)
│   ├── layout.tsx          # Root layout (NavbarMenu + container)
│   ├── page.tsx            # Landing page (server component)
│   ├── admin/
│   │   ├── layouts.tsx     # ⚠️ EMPTY — perlu diisi admin layout
│   │   └── page.tsx        # Admin dashboard (client component)
│   ├── auth/register/
│   │   └── page.tsx        # Form registrasi partner (client component)
│   └── partners/
│       └── page.tsx        # Partner dashboard (client component)
├── components/
│   ├── layouts/
│   │   └── navbar.tsx      # Navbar (logo, nav links, mobile menu)
│   ├── magicui/
│   │   └── globe.tsx       # Globe 3D (cobe) — TIDAK DIPAKAI
│   └── ui/                 # shadcn/ui components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── carousel.tsx    # TIDAK DIPAKAI
│       ├── chart.tsx       # TIDAK DIPAKAI
│       ├── navigation-menu.tsx
│       └── tabs.tsx
└── lib/
    └── utils.ts            # cn() utility (clsx + tailwind-merge)
```

## Current Status (Pre-Foundation)
- ✅ UI mockup untuk landing, admin dashboard, partner dashboard, register
- ❌ **No backend** — semua data hardcoded
- ❌ **No auth** — semua halaman publik
- ❌ **No database**
- ❌ **No API routes**
- ❌ Admin layout (`admin/layouts.tsx`) empty
- ❌ `referralLink` di partner dashboard pakai `useState` (harusnya const)
- ❌ Tombol copy-to-clipboard di-comment out
- ❌ Submit form register cuma `alert()`
- ❌ Metadata masih "Create Next App"
- ❌ Globe, Carousel, Chart components installed tapi tidak dipakai

## Key Conventions
1. **Tailwind v4**: Konfigurasi via CSS (`globals.css`), bukan `tailwind.config.js`
2. **shadcn/ui**: Jangan edit komponen di `src/components/ui/` — install ulang via CLI `npx shadcn@latest add [component]`
3. **Path alias**: `@/` → `./src/*`
4. **Font**: Geist via `next/font/google` — sudah di layout
5. **Icons**: Prioritaskan Lucide React, fallback ke React Icons
6. **Animasi**: Pakai `motion` (framer-motion) untuk animasi kompleks, Tailwind animate untuk yang sederhana
7. **Warna**: Pakai CSS variable (`--primary`, `--secondary`, dll) dari globals.css

## Common Tasks

### Adding a shadcn/ui component
```bash
npx shadcn@latest add button
```

### Running dev server
```bash
bun dev
```

### Building
```bash
bun run build
```

### Linting
```bash
bun run lint
```

## Route Design (Target)
| Route | Access | Status |
|-------|--------|--------|
| `/` | Public | ✅ Done |
| `/auth/login` | Public | ❌ Missing |
| `/auth/register` | Public | ✅ UI, ❌ Backend |
| `/partners` | Partner | ✅ UI, ❌ Backend |
| `/partners/referrals` | Partner | ❌ Missing |
| `/partners/settings` | Partner | ❌ Missing |
| `/admin` | Admin | ✅ UI, ❌ Backend |
| `/admin/partners` | Admin | ❌ Missing |
| `/admin/referrals` | Admin | ❌ Missing |
| `/admin/reports` | Admin | ❌ Missing |

## Auth Strategy (Recommended)
- **NextAuth.js v5** (Auth.js) dengan Credentials provider
- Role-based: `partner` dan `admin`
- Middleware untuk route protection
- Login page di `/auth/login`

## Data Fetching Pattern (Recommended)
```typescript
// Server Component — langsung fetch
async function getPartners() {
  const res = await fetch(`${process.env.API_URL}/api/partners`, {
    cache: 'no-store'
  });
  return res.json();
}

// Client Component — pakai custom hook atau React Query
```

## Error Handling Pattern (Recommended)
- Buat `src/app/error.tsx` (global error boundary)
- Buat `src/app/not-found.tsx` (custom 404)
- Buat `src/app/loading.tsx` (global loading state)
- Per-segment: `src/app/admin/error.tsx`, `src/app/admin/loading.tsx`

## Notes
- Jangan hapus komponen shadcn/ui yang sudah ada meski tidak dipakai
- Jangan commit langsung — tanya user dulu
- File `.env` jangan di-commit
- Untuk API external, selalu validasi input dengan Zod di server
- Database preferensi: Vercel Postgres atau Supabase
