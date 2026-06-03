# API Documentation — Partner Flow

**Base URL**: `/api`

**Auth**: Semua endpoint kecuali `/auth/*` memerlukan session token via cookie (HttpOnly, SameSite).

**Note**: Saat ini menggunakan dummy data (in-memory storage) untuk development. Database integration akan dilakukan pada fase berikutnya.

---

## Authentication

### POST /api/auth/register

Mendaftarkan partner baru (bisa dengan referral code dari partner existing).

**Request Body:**
```json
{
  "company_name": "TOKO MAKMUR",
  "industry": "Makanan & Minuman",
  "contact_person": "Budi Santoso",
  "email": "budi@tokomakmur.com",
  "phone": "08123456789",
  "monthly_volume": "100-500 box",
  "address": "Jl. Merdeka No. 123, Tangerang",
  "password": "securepassword123",
  "agree_terms": true,
  "marketing_consent": false,
  "referral_code": "PRT-2025-594589"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "partner_code": "PRT-2025-123456",
    "company_name": "TOKO MAKMUR",
    "email": "budi@tokomakmur.com",
    "referred_by": "uuid-partner-pengrefer"
  }
}
```

**Errors:** 400 (validasi), 409 (email/partner_code duplikat)

---

### POST /api/auth/login

Login untuk partner atau admin.

**Request Body:**
```json
{
  "email": "budi@tokomakmur.com",
  "password": "securepassword123",
  "role": "partner"
}
```

`role` bisa `"partner"` atau `"admin"`.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "budi@tokomakmur.com",
      "name": "TOKO MAKMUR",
      "role": "partner"
    }
  }
}
```

**Errors:** 401 (invalid credentials)

---

### POST /api/auth/logout

Menghapus session.

**Response 200:**
```json
{ "success": true }
```

---

### GET /api/auth/session

Mengecek session saat ini.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "budi@tokomakmur.com",
      "name": "TOKO MAKMUR",
      "role": "partner"
    }
  }
}
```

**Response 401:**
```json
{ "success": false, "error": "Not authenticated" }
```

---

## Partners

### GET /api/partners

List semua partner. (Admin only)

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Halaman |
| limit | number | 20 | Item per halaman |
| search | string | — | Cari nama/email |
| status | string | — | Filter status |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "partners": [
      {
        "id": "uuid",
        "partner_code": "PRT-2025-594589",
        "company_name": "TOKO MAKMUR",
        "email": "budi@tokomakmur.com",
        "status": "active",
        "total_referrals": 5,
        "total_conversions": 2,
        "created_at": "2025-01-15T08:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "total_pages": 3
    }
  }
}
```

---

### GET /api/partners/:id

Detail partner.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "partner_code": "PRT-2025-594589",
    "company_name": "TOKO MAKMUR",
    "industry": "Makanan & Minuman",
    "contact_person": "Budi Santoso",
    "email": "budi@tokomakmur.com",
    "phone": "08123456789",
    "monthly_volume": "100-500 box",
    "address": "Jl. Merdeka No. 123, Tangerang",
    "status": "active",
    "referred_by": {
      "id": "uuid",
      "company_name": "TK. IWAN - CIPUTAT"
    },
    "stats": {
      "total_referrals": 5,
      "pending": 1,
      "converted": 2,
      "declined": 1,
      "total_commission": 100000
    },
    "created_at": "2025-01-15T08:00:00Z"
  }
}
```

---

### PUT /api/partners/:id

Update data partner.

**Request Body:** (semua field opsional)
```json
{
  "company_name": "TOKO MAKMUR JAYA",
  "phone": "08123456788",
  "address": "Jl. Baru No. 456"
}
```

**Response 200:**
```json
{ "success": true, "data": { ...updated partner } }
```

---

### POST /api/partners/import

Import partner dari CSV. (Admin only)

**Request:** `multipart/form-data` dengan file CSV

**CSV Format:**
```
company_name,contact_person,email,phone,address
TOKO A,Budi,budi@a.com,0811,Jl. A
TOKO B,Siti,siti@b.com,0812,Jl. B
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "imported": 48,
    "failed": 2,
    "errors": [
      { "row": 3, "error": "Email already exists" }
    ]
  }
}
```

---

## Referrals

### GET /api/referrals

List referral. Partner melihat referral sendiri, admin melihat semua.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Halaman |
| limit | number | 20 | Item per halaman |
| status | string | — | Filter status |
| partner_id | string | — | Filter by partner (admin only) |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "referrals": [
      {
        "id": "uuid",
        "referral_code": "REF-2025-123456",
        "partner": {
          "id": "uuid",
          "company_name": "TOKO MAKMUR"
        },
        "referred_name": "Artha",
        "referred_phone": "08123456789",
        "status": "pending",
        "commission": 50000,
        "created_at": "2025-02-01T10:00:00Z",
        "converted_at": null
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 10, "total_pages": 1 }
  }
}
```

---

### POST /api/referrals

Membuat referral baru.

**Request Body:**
```json
{
  "referred_name": "Artha",
  "referred_phone": "08123456789",
  "notes": "Diajak kerja sama"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "referral_code": "REF-2025-123456",
    "status": "pending",
    "share_link": "https://partner-referral-hub.vercel.app/register?ref=REF-2025-123456"
  }
}
```

---

### PUT /api/referrals/:id/approve

Menyetujui referral. (Admin only)

**Response 200:**
```json
{ "success": true, "data": { "id": "uuid", "status": "approved" } }
```

---

### PUT /api/referrals/:id/decline

Menolak referral. (Admin only)

**Request Body:**
```json
{ "reason": "Data tidak valid" }
```

**Response 200:**
```json
{ "success": true, "data": { "id": "uuid", "status": "declined", "notes": "Data tidak valid" } }
```

---

### GET /api/referrals/stats

Statistik referral untuk partner dashboard.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "pending": 2,
    "approved": 3,
    "converted": 4,
    "declined": 1,
    "total_commission": 200000,
    "commission_paid": 50000,
    "commission_pending": 150000
  }
}
```

---

## Admin

### GET /api/admin/stats

Dashboard stats.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_partners": 28,
    "active_partners": 25,
    "total_referrals": 150,
    "pending_referrals": 12,
    "total_conversions": 45,
    "total_commission_paid": 2250000,
    "total_commission_pending": 600000,
    "recent_activities": [
      {
        "id": "uuid",
        "action": "new_referral",
        "description": "TOKO MAKMUR mereferensikan Artha",
        "created_at": "2025-03-01T08:00:00Z"
      }
    ]
  }
}
```

---

### GET /api/admin/activities

Activity log (pagination).

**Query Parameters:** page, limit

**Response 200:**
```json
{
  "success": true,
  "data": {
    "activities": [ ... ],
    "pagination": { "page": 1, "limit": 20, "total": 200, "total_pages": 10 }
  }
}
```

---

### GET /api/admin/reports/download

Download report sebagai Excel.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| type | string | `partners`, `referrals`, `commissions` |
| start_date | string | Filter tanggal (YYYY-MM-DD) |
| end_date | string | Filter tanggal (YYYY-MM-DD) |

**Response 200:** File Excel (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

---

## Error Response Format

Semua error mengikuti format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email sudah terdaftar",
    "details": [
      { "field": "email", "message": "Email sudah digunakan" }
    ]
  }
}
```

### Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Input tidak valid |
| UNAUTHORIZED | 401 | Belum login |
| FORBIDDEN | 403 | Tidak punya akses |
| NOT_FOUND | 404 | Resource tidak ditemukan |
| CONFLICT | 409 | Duplikat data |
| INTERNAL_ERROR | 500 | Server error |

---

## Validation Rules

| Field | Rules |
|-------|-------|
| email | Valid email, max 255 chars |
| phone | Min 10, max 15 digits |
| password | Min 8 chars, max 100 chars |
| company_name | Required, max 255 chars |
| contact_person | Required, max 255 chars |
| referred_name | Required, max 255 chars |
| referred_phone | Required, min 10 digits |
| referral_code | Format: `PRT-YYYY-NNNNNN` atau `REF-YYYY-NNNNNN` |
