# Data Model — Partner Flow

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   Partner    │       │   Referral    │       │    Admin     │
├─────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)     │──┐    │ id (PK)      │       │ id (PK)      │
│ partner_code│  │    │ partner_id   │◄──────│ username     │
│ company_name│  │    │ (FK)         │       │ email        │
│ industry    │  │    │ referral_code│       │ password_hash│
│ contact     │  │    │ referred_name│       │ role         │
│ email       │  │    │ referred_phn │       │ created_at   │
│ phone       │  │    │ status       │       │ updated_at   │
│ volume      │  │    │ commission   │       └──────────────┘
│ address     │  │    │ notes        │              │
│ password_ha │  │    │ created_at   │              │
│ status      │  │    │ updated_at   │              │
│ created_at  │  │    │ converted_at │              │
│ updated_at  │  │    │ approved_by  │◄────────────┘
│ referred_by │──┘    │ (FK,nullable)│
│ (FK,self)   │       └──────────────┘
└─────────────┘              │
        │                    │
        │       ┌────────────┴───────────┐
        │       │      ActivityLog        │
        │       ├────────────────────────┤
        └──────►│ id (PK)                │
                │ partner_id (FK,nullable)│
                │ admin_id (FK,nullable)  │
                │ action                  │
                │ description             │
                │ created_at              │
                └────────────────────────┘
```

---

## Table: Partner

Kolom penyimpan data mitra (distributor/reseller).

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | UUID | PK, default uuid_generate_v4() | Primary key |
| partner_code | VARCHAR(50) | UNIQUE, NOT NULL | Kode unik partner (generated: PRT-YYYY-NNNNNN) |
| company_name | VARCHAR(255) | NOT NULL | Nama perusahaan/toko |
| industry | VARCHAR(100) | nullable | Jenis industri |
| contact_person | VARCHAR(255) | NOT NULL | Nama kontak person |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email untuk login |
| phone | VARCHAR(50) | NOT NULL | Nomor telepon |
| monthly_volume | VARCHAR(100) | nullable | Volume pembelian bulanan |
| address | TEXT | nullable | Alamat lengkap |
| password_hash | VARCHAR(255) | NOT NULL | Hash password (bcrypt) |
| status | ENUM('active','inactive','suspended') | DEFAULT 'active' | Status akun |
| referred_by | UUID | FK → Partner(id), nullable | Partner yang mereferensikan |
| has_marketing_consent | BOOLEAN | DEFAULT false | Izin marketing |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Waktu diupdate |

**Indexes:**
- `partner_code` UNIQUE
- `email` UNIQUE
- `referred_by` (FK)
- `status`

---

## Table: Referral

Kolom penyimpan data referral yang dibuat oleh partner.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | UUID | PK | Primary key |
| partner_id | UUID | FK → Partner(id), NOT NULL | Partner yang mereferensikan |
| referral_code | VARCHAR(50) | UNIQUE, NOT NULL | Kode referral unik |
| referred_name | VARCHAR(255) | NOT NULL | Nama calon mitra |
| referred_phone | VARCHAR(50) | NOT NULL | No HP calon mitra |
| status | ENUM('pending','approved','declined','converted') | DEFAULT 'pending' | Status referral |
| notes | TEXT | nullable | Catatan admin |
| commission | INTEGER | DEFAULT 50000 | Komisi yang akan dibayarkan |
| approved_by | UUID | FK → Partner(id), nullable | Yang menyetujui (partner) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Waktu diupdate |
| converted_at | TIMESTAMPTZ | nullable | Waktu dikonversi |

**Indexes:**
- `referral_code` UNIQUE
- `partner_id` (FK)
- `status`

---

## Table: Admin

Kolom penyimpan data admin platform.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | UUID | PK | Primary key |
| username | VARCHAR(100) | UNIQUE, NOT NULL | Username admin |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email admin |
| password_hash | VARCHAR(255) | NOT NULL | Hash password (bcrypt) |
| role | ENUM('superadmin','admin') | DEFAULT 'admin' | Role admin |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Waktu diupdate |

**Indexes:**
- `username` UNIQUE
- `email` UNIQUE

---

## Table: ActivityLog

Kolom untuk audit trail aktivitas di platform.

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | UUID | PK | Primary key |
| partner_id | UUID | FK → Partner(id), nullable | Partner terkait |
| admin_id | UUID | FK → Admin(id), nullable | Admin terkait |
| action | VARCHAR(100) | NOT NULL | Aksi yang dilakukan |
| description | TEXT | nullable | Deskripsi detail |
| metadata | JSONB | nullable | Data tambahan (JSON) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Waktu kejadian |

**Indexes:**
- `partner_id` (FK)
- `admin_id` (FK)
- `created_at`

---

## Enums

```sql
CREATE TYPE partner_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE referral_status AS ENUM ('pending', 'approved', 'declined', 'converted');
CREATE TYPE admin_role AS ENUM ('superadmin', 'admin');
```

---

## Referral Code Format

```
PRT-YYYY-NNNNNN
├──┘├──┘├──────┘
│   │   └── 6 digit random number
│   └── Tahun registrasi
└── Prefix "PRT" (Partner)
```

Contoh: `PRT-2025-594589`

---

## Komisi

- **Default**: Rp 50.000 per referral yang berhasil dikonversi
- **Payment status**: Dikelola via field `commission` di tabel Referral (opsional: tabel Conversion terpisah)
- **Payment flow**: Admin menandai sebagai "paid" setelah komisi dibayarkan ke partner

---

## Query Examples

### Dashboard Stats (Admin)
```sql
SELECT
  (SELECT COUNT(*) FROM partner WHERE status = 'active') AS total_partners,
  (SELECT COUNT(*) FROM referral) AS total_referrals,
  (SELECT COUNT(*) FROM referral WHERE status = 'converted') AS total_conversions,
  (SELECT COALESCE(SUM(commission), 0) FROM referral WHERE status = 'converted') AS total_commission;
```

### Recent Referrals (Partner)
```sql
SELECT * FROM referral
WHERE partner_id = $1
ORDER BY created_at DESC
LIMIT 10;
```

### Referral Stats (Partner Dashboard)
```sql
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending,
  COUNT(*) FILTER (WHERE status = 'approved') AS approved,
  COUNT(*) FILTER (WHERE status = 'converted') AS converted,
  COUNT(*) FILTER (WHERE status = 'declined') AS declined,
  COALESCE(SUM(commission) FILTER (WHERE status = 'converted'), 0) AS total_commission
FROM referral
WHERE partner_id = $1;
```
