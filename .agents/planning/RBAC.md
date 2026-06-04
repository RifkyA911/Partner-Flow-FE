# Role-Based Access Control (RBAC) Documentation

## Overview
This document defines the Role-Based Access Control (RBAC) system for the Partner Flow application.

## Roles

### 1. Partner
- **Role ID**: `partner`
- **Description**: Regular users who participate in the referral program
- **Access Level**: Limited to their own data and referral management

**Permissions:**
- View own dashboard
- View own referral statistics
- Generate and share referral links
- Track own referrals
- View own earnings
- Access QR code for referrals
- Share on social media

**Restricted Access:**
- Cannot view other partners' data
- Cannot approve or reject referrals
- Cannot view system-wide statistics
- Cannot manage other users

### 2. Admin
- **Role ID**: `admin`
- **Description**: System administrators with full access to platform management
- **Access Level**: Full system access

**Permissions:**
- View all partners and their data
- View all referrals across the platform
- Approve or reject pending referrals
- Convert referrals to partners
- View system-wide statistics
- View partner login credentials (with toggle)
- Access all dashboard tabs (Dashboard, Partners, Referrals)
- View recent activity across the platform

**Additional Capabilities:**
- Can view partner passwords (when "Show Passwords" is enabled)
- Can manage referral status transitions
- Can monitor platform health and activity

## Role Assignment

### Automatic Assignment
Roles are assigned during the registration process based on:
- **Partner**: Default role for all new registrations
  - When a user registers via `/auth/register` or signs up with Google OAuth, they automatically receive the "partner" role
  - The JWT callback in `auth.ts` sets: `token.role = user.role || "partner"`
  - This ensures all new users start as partners with access to their own dashboard and referral management

- **Admin**: Manually assigned in the database (not available through public registration)
  - Admin role cannot be obtained through the registration form
  - Must be manually assigned by:
    1. Direct database manipulation (UPDATE users SET role = 'admin' WHERE email = '...')
    2. Backend API endpoint (if implemented)
    3. Initial seed data during database setup
  - Currently, admin access is only available through demo accounts or manual database assignment

### Role Storage
Roles are stored in the user session and database:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "partner" | "admin";
  partner_code?: string;
  // ... other fields
}
```

## Access Control Implementation

### Dashboard Access
The `/dashboard` route uses conditional rendering based on user role:

```typescript
const userRole = session?.user?.role;

if (userRole === "partner") {
  // Render Partner Dashboard
  return <PartnerDashboard />;
} else if (userRole === "admin") {
  // Render Admin Dashboard
  return <AdminDashboard />;
}
```

### Route Protection
Protected routes check authentication and role:
```typescript
useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/auth/login");
    return;
  }

  if (session?.user) {
    const userRole = session.user.role;
    // Role-specific logic
  }
}, [session, status, router]);
```

## API Access Control

### Partner API Endpoints
- `GET /api/referrals?partner_id={id}` - View own referrals only
- `POST /api/referrals` - Create new referrals

### Admin API Endpoints
- `GET /api/partners` - View all partners
- `GET /api/referrals` - View all referrals
- `PUT /api/referrals/{id}` - Update referral status
- `POST /api/partners` - Create new partners (if needed)

## Security Considerations

### 1. Server-Side Validation
All API endpoints must validate the user's role before granting access to sensitive data.

### 2. Session Management
Roles are stored in the session and validated on each request.

### 3. Data Isolation
Partners can only access their own data. Admins can access all data.

### 4. Credential Protection
Partner passwords are only visible to admins when explicitly enabled via the "Show Passwords" toggle.

## Future Enhancements

### Potential Additional Roles
- **Moderator**: Limited admin access for content moderation
- **Manager**: Team lead role with access to team member data
- **Viewer**: Read-only access for analytics

### Permission Granularity
Consider implementing a more granular permission system:
```typescript
interface Permission {
  canViewDashboard: boolean;
  canManagePartners: boolean;
  canApproveReferrals: boolean;
  canViewCredentials: boolean;
  // ... more permissions
}
```

## Testing RBAC

### Test Scenarios
1. Partner cannot access admin-specific features
2. Admin can view all partner data
3. Partner can only view own referrals
4. Role changes require re-authentication
5. Session expiration revokes access

### Demo Accounts
- **Partner Demo**: `partner@example.com` / `partner123`
- **Admin Demo**: `admin@partnerflow.com` / `admin123`

## Summary

The RBAC system ensures:
- **Data Security**: Partners can only access their own data
- **Administrative Control**: Admins have full platform oversight
- **Scalability**: Easy to add new roles and permissions
- **Clear Separation**: Distinct interfaces for different user types
