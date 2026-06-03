# Architecture Overview — Partner Flow

## Architecture Pattern

**Hybrid Next.js Architecture** — Server Components untuk halaman publik/static, Client Components untuk halaman interaktif, API Routes untuk backend logic.

**Current Status**: Development phase menggunakan in-memory storage (dummy data). Database integration akan dilakukan pada fase berikutnya sesuai timeline di SDD.

```
┌─────────────────────────────────────────────────┐
│                   Browser                         │
└─────────────────┬───────────────────────────────┘
                  │ HTTP/HTTPS
                  ▼
┌─────────────────────────────────────────────────┐
│              Next.js (Vercel)                     │
├──────────────────┬──────────────────────────────┤
│  Server Side     │    Client Side                │
│                  │                               │
│  ┌────────────┐  │  ┌─────────────────────────┐ │
│  │ API Routes │  │  │ React Components         │ │
│  │ /api/*     │  │  │ (interactive pages)      │ │
│  └─────┬──────┘  │  └─────────────────────────┘ │
│        │         │                               │
│  ┌─────▼──────┐  │  ┌─────────────────────────┐ │
│  │ Server     │  │  │ Client Components        │ │
│  │ Components │  │  │ (useState, useEffect,    │ │
│  │ (SSR/SSG)  │  │  │  user interaction)       │ │
│  └────────────┘  │  └─────────────────────────┘ │
└────────┬─────────┴──────────────────────────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│   PostgreSQL      │     │  3rd Party APIs   │
│  (Vercel/Supabase)│     │  (Email, dll)     │
└──────────────────┘     └──────────────────┘
```

## Component Architecture

### Page Types
| Tipe | Contoh | Karakteristik |
|------|--------|---------------|
| Server Component | Landing page (`/`) | Static, SEO-friendly, no hooks |
| Client Component | Dashboard, Form | Interaktif, stateful, hooks |

### Data Flow
```
Server Component
  ├── Fetch data langsung di komponen (async)
  ├── Render HTML di server
  └── Kirim ke browser (no JS needed for initial render)

Client Component
  ├── Fetch data via useEffect / React Query
  ├── Render di browser
  └── Butuh JS untuk interaktivitas
```

### State Management
- **No global state store** (untuk skala saat ini)
- **React Context** jika perlu shared state (opsional)
- **URL search params** untuk filter, search, pagination
- **Server state** via fetch → API Routes → Database

## Route Architecture

```
/                          # Public — Landing page (Server)
/auth/login                # Public — Login form (Client)
/auth/register             # Public — Register form (Client)
/partners/*                # Protected — Partner area (Client)
/partners                  # Partner dashboard
/partners/referrals        # Referral management
/partners/settings         # Account settings
/admin/*                   # Protected — Admin area (Client)
/admin                     # Admin dashboard
/admin/partners            # Partner management
/admin/referrals           # Referral management
/admin/reports             # Reports & export
/api/*                     # API Routes
/api/auth/*                # Auth endpoints
/api/partners/*            # Partner CRUD
/api/referrals/*           # Referral CRUD
/api/admin/*               # Admin operations
```

## Security Architecture

### Route Protection (Middleware)
```
Request → Middleware → Check Session
  ├── Authenticated + Role matches → Allow
  ├── Authenticated + Wrong role → Redirect to appropriate dashboard
  ├── Not authenticated + Protected route → Redirect to /auth/login
  └── Not authenticated + Public route → Allow
```

### Auth Flow
```
Login Form → POST /api/auth/login
  ├── Validate credentials → Generate JWT/Session
  ├── Set cookie/httpOnly
  └── Redirect to dashboard

Middleware → Read cookie → Verify session
  ├── Valid → Attach user info to request
  └── Invalid → Clear cookie → Redirect login
```

## Database Architecture

### Connection Strategy
- **Vercel Postgres**: Serverless, auto-scaling, langsung terintegrasi dengan Vercel
- **Atau Supabase**: Lebih banyak fitur (real-time, auth, storage)
- Connection pooling via Prisma/Drizzle acceleration

### Migration Strategy
- Prisma Migrate atau Drizzle Kit
- Migration files di version control
- Auto-migrate di development, manual di production

## Deployment Architecture

```yaml
Platform: Vercel
Framework preset: Next.js
Build command: bun run build
Output: .next/
Environment:
  - DATABASE_URL (production/Preview)
  - AUTH_SECRET
  - NEXT_PUBLIC_APP_URL
Domains:
  - Primary: partner-flow.vercel.app (development)
  - Production: [custom domain]
```

## Performance Considerations

1. **Image Optimization**: Gunakan `next/image` untuk semua gambar
2. **Bundle**: Dynamic import untuk komponen berat (globe, chart)
3. **Caching**: API Routes dengan `cache` header
4. **ISR**: Untuk halaman yang perlu data real-time
5. **Font**: Geist sudah via CDN (next/font/google)

## Monitoring & Logging
- Vercel Analytics untuk traffic
- Console logging di API Routes
- Error tracking: Sentry (opsional)
- Uptime monitoring: Better Uptime atau Pingdom
