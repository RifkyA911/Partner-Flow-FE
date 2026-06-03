# Roadmap Pengembangan — Partner Flow

## Fase 0: Analisis & Dokumentasi (Sekarang)
- [x] Analisis codebase existing
- [x] Dokumentasi SDD, AGENT.md, ARCHITECTURE.md
- [ ] Prioritaskan fitur yang akan dibangun

---

## Fase 1: Foundation (Minggu 1-2)
### Database & ORM
- [ ] Setup PostgreSQL (Vercel Postgres / Supabase)
- [ ] Setup Prisma atau Drizzle ORM
- [ ] Buat schema: Partner, Referral, Admin, ActivityLog
- [ ] Migration database

### Authentication
- [ ] Install & setup NextAuth.js v5
- [ ] Buat halaman `/auth/login`
- [ ] Implementasi Credentials provider (partner + admin)
- [ ] Middleware untuk route protection
- [ ] Logout functionality

### API Routes
- [ ] `POST /api/auth/register` — Registrasi partner
- [ ] `POST /api/auth/login` — Login
- [ ] `GET /api/auth/session` — Session check

---

## Fase 2: Core Features (Minggu 3-5)
### Partner Endpoints
- [ ] `GET /api/partners` + pagination
- [ ] `GET /api/partners/:id`
- [ ] `PUT /api/partners/:id`

### Referral Endpoints
- [ ] `GET /api/referrals` (by partner / all)
- [ ] `POST /api/referrals`
- [ ] `PUT /api/referrals/:id/approve`
- [ ] `PUT /api/referrals/:id/decline`
- [ ] `GET /api/referrals/stats`

### Admin Endpoints
- [ ] `GET /api/admin/stats`
- [ ] `GET /api/admin/activities`
- [ ] `POST /api/partners/import` (CSV upload)

### Frontend Integration
- [ ] Wire up partner dashboard dengan data real
- [ ] Wire up admin dashboard dengan data real
- [ ] Wire up registration form → API
- [ ] Implementasi admin layout (`admin/layouts.tsx`)

---

## Fase 3: Polish & UX (Minggu 6)
- [ ] Loading skeletons untuk semua halaman
- [ ] Error boundaries (`error.tsx`)
- [ ] Custom 404 page (`not-found.tsx`)
- [ ] Toast notifications (success/error)
- [ ] Update metadata (title, description, favicon)
- [ ] QR code generator untuk referral link
- [ ] Copy-to-clipboard functionality
- [ ] Remove unused code (commented toast, dll)

---

## Fase 4: Advanced Features (Minggu 7-8)
- [ ] Dashboard charts (Recharts) — tren referral & komisi
- [ ] Export report Excel
- [ ] Bulk import partner via CSV
- [ ] Search & filter pada tabel
- [ ] Email notification (via Resend / Nodemailer)
- [ ] Pagination pada semua list

---

## Fase 5: Launch (Minggu 9)
- [ ] Testing end-to-end
- [ ] Performance audit (Lighthouse)
- [ ] Security review
- [ ] Setup domain & DNS
- [ ] Deploy ke Vercel
- [ ] Monitoring setup

---

## Legend
- ✅ = Selesai
- [ ] = Belum dikerjakan
- ⏳ = Sedang dikerjakan
- ❌ = Dibatalakan / ditunda

---

## Catatan
Prioritas utama: **Foundation** harus solid sebelum lanjut ke fitur lain. Jangan tergoda untuk langsung mengerjakan UI/UX polish sebelum backend dan auth berfungsi.
