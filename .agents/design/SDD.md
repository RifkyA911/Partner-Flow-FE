# Software Design Document (SDD) — Partner Flow

## 1. Pendahuluan

### 1.1 Tujuan
Dokumen ini mendeskripsikan perancangan software untuk **Partner Flow**, sebuah platform web yang memungkinkan mitra (distributor/reseller) untuk mereferensikan bisnis baru dan mendapatkan komisi, serta admin untuk mengelola dan memonitor aktivitas referral.

### 1.2 Ruang Lingkup
- Frontend: Next.js 15 (App Router) + Tailwind CSS v4 + shadcn/ui
- Backend: Next.js API Routes (REST)
- Database: PostgreSQL (via Vercel Postgres atau Supabase)
- Auth: NextAuth.js atau Clerk
- Deployment: Vercel

### 1.3 Definisi, Akronim, Singkatan
| Istilah | Definisi |
|---------|----------|
| Partner | Mitra/distributor/reseller yang mendaftar di platform |
| Referral | Calon mitra yang direferensikan oleh partner |
| Conversion | Referral yang berhasil mendaftar dan disetujui admin |
| Komisi | Rp 50.000 per referral yang dikonversi |
| Admin | Pengelola platform |

---

## 2. Arsitektur Sistem

### 2.1 High-Level Architecture

```
[Browser] ←→ [Next.js App (Vercel)]
                   │
          ┌────────┴────────┐
          │                 │
   [API Routes]      [Server Components]
          │                 │
    [PostgreSQL]     [Static Pages]
          │
    [Vercel Postgres / Supabase]
```

### 2.2 Tech Stack
| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 15.3.5 |
| Bahasa | TypeScript 5 |
| Styling | Tailwind CSS v4 + tw-animate-css |
| UI Library | shadcn/ui (New York style) |
| Icons | Lucide React + React Icons |
| Charts | Recharts |
| Font | Geist (next/font/google) |
| Database | PostgreSQL |
| ORM | Prisma atau Drizzle |
| Auth | NextAuth.js v5 |
| Deployment | Vercel |

### 2.3 Component Tree (Frontend)
```
RootLayout
├── NavbarMenu
│   ├── DesktopNav (Link: Import, Download, Customer View, Logout)
│   └── MobileMenu (Hamburger toggle)
├── LandingPage (/)
│   ├── HeroSection
│   ├── FeatureCards (3 cards)
│   ├── LoginCards (Partner + Admin)
│   └── HowItWorks (4 steps)
├── AdminDashboard (/admin)
│   ├── StatsGrid (4 cards)
│   ├── RecentActivity
│   └── TabPanel
│       ├── PartnersTable
│       └── ReferralManagement
├── PartnerDashboard (/partners)
│   ├── WelcomeBanner
│   ├── StatsCards (4 cards)
│   ├── ReferralTools
│   │   ├── ReferralLink (copy/share)
│   │   ├── QRCode
│   │   └── SocialShare
│   └── RecentReferrals
└── RegisterPage (/auth/register)
    ├── ReferralBanner
    ├── FeatureIcons
    └── RegistrationForm
```

---

## 3. Data Model

### 3.1 Entity Relationship

```
Partner
├── id (UUID, PK)
├── partner_code (VARCHAR, UNIQUE)
├── company_name (VARCHAR)
├── industry (VARCHAR)
├── contact_person (VARCHAR)
├── email (VARCHAR, UNIQUE)
├── phone (VARCHAR)
├── monthly_volume (VARCHAR)
├── address (TEXT)
├── password_hash (VARCHAR)
├── status (ENUM: active, inactive, suspended)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── referred_by (UUID, FK → Partner.id) [nullable]

Referral
├── id (UUID, PK)
├── partner_id (UUID, FK → Partner.id)
├── referral_code (VARCHAR, UNIQUE)
├── referred_name (VARCHAR)
├── referred_phone (VARCHAR)
├── status (ENUM: pending, approved, declined, converted)
├── notes (TEXT)
├── commission (INTEGER, default 50000)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
└── converted_at (TIMESTAMP) [nullable]

Conversion (opsional, bisa digabung dgn Referral)
├── id (UUID, PK)
├── referral_id (UUID, FK → Referral.id)
├── partner_id (UUID, FK → Partner.id)
├── commission_amount (INTEGER)
├── approved_by (UUID, FK → Admin.id)
├── approved_at (TIMESTAMP)
└── status (ENUM: pending_payment, paid)

Admin
├── id (UUID, PK)
├── username (VARCHAR, UNIQUE)
├── email (VARCHAR, UNIQUE)
├── password_hash (VARCHAR)
├── role (ENUM: superadmin, admin)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

ActivityLog
├── id (UUID, PK)
├── partner_id (UUID, FK → Partner.id) [nullable]
├── admin_id (UUID, FK → Admin.id) [nullable]
├── action (VARCHAR)
├── description (TEXT)
├── created_at (TIMESTAMP)
```

### 3.2 Status Flow

```
Referral Status Flow:
[Pending] → [Approved] → [Converted] (calon daftar & disetujui)
[Pending] → [Declined]

Partner Status Flow:
[Active] → [Suspended]
[Suspended] → [Active]
```

---

## 4. API Design

### 4.1 Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | /api/auth/register | Registrasi partner baru |
| POST | /api/auth/login | Login partner/admin |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/session | Cek session saat ini |

### 4.2 Partner Endpoints
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /api/partners | List partner (admin only) |
| GET | /api/partners/:id | Detail partner |
| PUT | /api/partners/:id | Update profil partner |
| POST | /api/partners/import | Import partner via CSV (admin) |

### 4.3 Referral Endpoints
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /api/referrals | List referral (by partner atau all utk admin) |
| POST | /api/referrals | Buat referral baru |
| PUT | /api/referrals/:id | Update referral |
| PUT | /api/referrals/:id/approve | Approve referral (admin) |
| PUT | /api/referrals/:id/decline | Decline referral (admin) |
| GET | /api/referrals/stats | Statistik referral |

### 4.4 Admin Endpoints
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/activities | Activity log |
| GET | /api/admin/reports/download | Download report excel |

---

## 5. Frontend Routes & Access Control

| Route | Akses | Deskripsi |
|-------|-------|-----------|
| `/` | Public | Landing page |
| `/auth/login` | Public | Login form |
| `/auth/register` | Public (dengan referral code) | Registrasi partner |
| `/partners` | Partner | Dashboard partner |
| `/partners/referrals` | Partner | Kelola referral |
| `/partners/settings` | Partner | Pengaturan akun |
| `/admin` | Admin | Dashboard admin |
| `/admin/partners` | Admin | Manajemen partner |
| `/admin/referrals` | Admin | Manajemen referral |
| `/admin/reports` | Admin | Laporan & export |

---

## 6. Komponen yang Perlu Dibangun

### 6.1 Segera (Critical Path)
1. **Auth System** — Login/register/logout dengan NextAuth.js
2. **API Routes** — REST endpoints untuk partner & referral CRUD
3. **Database Schema** — Prisma/Drizzle models + migration
4. **Admin Layout** — Sidebar layout untuk halaman admin
5. **Registration Form Integration** — Submit form ke API

### 6.2 Peningkatan UI/UX
1. **Loading States** — Skeleton loading, spinner
2. **Error Boundaries** — Error page per segment
3. **Toast Notifications** — react-hot-toast atau sonner
4. **QR Code Generator** — qrcode.react
5. **Copy to Clipboard** — navigator.clipboard API

### 6.3 Fitur Tambahan
1. **Email Notification** — Kirim email saat referral di-approve/decline
2. **Export Report** — Download laporan Excel
3. **Bulk Import** — Import partner dari CSV
4. **Pagination & Search** — Untuk tabel partner & referral
5. **Dashboard Charts** — Grafik performa (Recharts)

---

## 7. Security Considerations

- Password hashing dengan bcrypt
- JWT atau session-based auth
- Middleware untuk route protection
- Input validation di server (Zod)
- Rate limiting pada endpoint publik
- CSRF protection
- Environment variables untuk secrets
- SQL injection protection via ORM

---

## 8. Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
AUTH_SECRET="..."
AUTH_URL="https://..."

# App
NEXT_PUBLIC_APP_URL="https://partner-flow.vercel.app"
NEXT_PUBLIC_APP_NAME="Partner Flow"

# Email (opsional)
SMTP_HOST="..."
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASS="..."
```

---

## 9. Milestone & Timeline

| Fase | Durasi | Deliverable |
|------|--------|-------------|
| Fase 1: Foundation | 1-2 minggu | Database + Auth + API Routes |
| Fase 2: Core Features | 2-3 minggu | Referral CRUD, Admin panel, Dashboard |
| Fase 3: Integration | 1 minggu | Frontend-backend integration, form submission |
| Fase 4: Polish | 1 minggu | Loading, error handling, responsive, metadata |
| Fase 5: Launch | 3-5 hari | Testing, deployment, domain config |

---

## 10. Catatan Teknis

- Project menggunakan **Bun** sebagai package manager
- Tailwind v4 tidak menggunakan `tailwind.config.js` — konfigurasi via CSS
- shadcn/ui komponen ada di `src/components/ui/`
- Path alias: `@/` → `./src/*`
- Semua halaman kecuali landing page menggunakan `"use client"`
