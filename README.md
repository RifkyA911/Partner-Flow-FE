[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth-5.0-000000?style=flat&logo=nextauth)](https://next-auth.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

<div align="center">

# 🚀 Partner Flow — Referral Partners Platform

**A modern referral partner platform built for Aice Tangerang Selatan**

[![Demo](https://img.shields.io/badge/Demo-Live-orange)](http://localhost:3000)
[![Documentation](https://img.shields.io/badge/Docs-Wiki-blue)](https://github.com/partner-flow/docs)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Authentication](#-authentication)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

Partner Flow is a comprehensive referral partner platform designed for Aice in the Tangerang Selatan region. Built with Next.js for optimal performance and SEO, it enables businesses to manage their referral programs efficiently through a modern, intuitive interface.

### Key Benefits

- 🎯 **Multi-Level Referral System** - Partners can earn commissions from their referrals and their referrals' referrals
- 📊 **Real-Time Analytics** - Track referrals, commissions, and performance metrics in real-time
- 🔐 **Role-Based Access Control** - Separate dashboards for partners and administrators
- 🌐 **Social Media Integration** - Easy sharing across multiple platforms
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Dark Mode Support** - Built-in theme switching for user comfort

---

## ✨ Features

### For Partners

- 🏠 **Personal Dashboard** - View referral statistics, earnings, and performance metrics
- 🔗 **Referral Link Generation** - Unique referral codes for tracking
- 📤 **Social Media Sharing** - One-click sharing to Facebook, Twitter, LinkedIn, WhatsApp, and Email
- 📋 **Referral Tracking** - Monitor referral status (pending, approved, rejected)
- 💰 **Commission Tracking** - View earnings and commission history
- 📊 **Performance Analytics** - Detailed statistics on referral performance
- 🎁 **Referral Bonuses** - Multi-level commission structure

### For Administrators

- 👥 **Partner Management** - View and manage all registered partners
- 🔐 **Credential Access** - View partner login credentials (with toggle)
- 📝 **Referral Approval** - Approve or reject pending referrals
- 🔄 **Referral Conversion** - Convert successful referrals to partners
- 📈 **Platform Analytics** - System-wide statistics and insights
- 🎛️ **Activity Monitoring** - Track recent platform activity
- 📊 **Data Export** - Export partner and referral data

### Authentication

- 🔑 **Email/Password Login** - Traditional authentication method
- 🌐 **Google OAuth** - Sign in with Google account
- 📝 **Registration Wizard** - Step-by-step onboarding for new users
- 🔒 **Secure Sessions** - JWT-based session management
- 🛡️ **Protected Routes** - Route-level access control

---

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 15.3](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icon library
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library

### Backend Integration

- **Authentication**: [NextAuth.js 5.0](https://next-auth.js.org/) - Complete authentication solution
- **API**: RESTful API integration with backend service
- **State Management**: React Hooks and Context API

### Development Tools

- **Package Manager**: npm/yarn
- **Linting**: ESLint
- **Code Formatting**: Prettier (recommended)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Backend API service running on configured port

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/partner-flow/partner-flow-fe.git
cd partner-flow-fe
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Partner Flow"

# Backend API
NEXT_PUBLIC_BACKEND_URL="http://localhost:8080"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. **Generate NextAuth secret**
```bash
openssl rand -base64 32
```

5. **Run development server**
```bash
npm run dev
```

6. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Frontend application URL | Yes | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | Yes | `Partner Flow` |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | Yes | `http://localhost:8080` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | No | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | No | - |
| `NEXTAUTH_URL` | NextAuth URL | Yes | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes | - |

### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 client ID
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
4. Copy Client ID and Client Secret to your `.env` file

---

## 📁 Project Structure

```
partner-flow-fe/
├── .env.example            # Environment variables template
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # Authentication endpoints
│   │   │   │   ├── login/ # Login endpoint
│   │   │   │   ├── register/ # Registration endpoint
│   │   │   │   └── onboarding/ # Onboarding endpoint
│   │   │   └── partners/  # Partner endpoints
│   │   ├── auth/          # Authentication pages
│   │   │   ├── login/     # Login page
│   │   │   ├── register/  # Registration page
│   │   │   └── onboarding/ # Onboarding wizard
│   │   ├── dashboard/     # Dashboard pages
│   │   │   └── page.tsx   # Main dashboard
│   │   └── page.tsx       # Homepage
│   ├── components/        # React components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   │   ├── stats-card.tsx
│   │   │   ├── referral-tools.tsx
│   │   │   ├── referrals-table.tsx
│   │   │   ├── partners-table.tsx
│   │   │   ├── referral-management.tsx
│   │   │   ├── partner-dashboard.tsx
│   │   │   └── admin-dashboard.tsx
│   │   ├── layouts/       # Layout components
│   │   │   └── navbar.tsx
│   │   ├── providers/     # Context providers
│   │   │   └── theme-provider.tsx
│   │   └── ui/            # UI components
│   ├── config.ts          # Configuration file
│   ├── lib/               # Utility libraries
│   │   └── auth.ts        # NextAuth configuration
│   └── types/             # TypeScript type definitions
│       └── next-auth.d.ts # NextAuth types
├── package.json           # Dependencies
└── README.md             # This file

Note: The .agents folder is located at the parent directory (../.agents) and contains project documentation.
```

---

## 👥 User Roles

### Partner Role

**Default role for all new registrations**

- Automatically assigned during registration
- Access to personal dashboard
- Can create and share referral links
- Track own referrals and earnings
- Cannot view other partners' data
- Cannot approve or reject referrals

### Admin Role

**Manually assigned by database administrators**

- Full platform access
- View all partners and their data
- View all referrals across the platform
- Approve or reject pending referrals
- Convert referrals to partners
- View partner credentials (with toggle)
- Access system-wide analytics

**How to obtain admin role:**
1. Direct database manipulation: `UPDATE users SET role = 'admin' WHERE email = '...'`
2. Backend API endpoint (if implemented)
3. Initial seed data during database setup

**Demo Accounts:**
- Partner: `partner@example.com` / `partner123`
- Admin: `admin@partnerflow.com` / `admin123`

---

## 🔐 Authentication

### Login Methods

1. **Email/Password**
   - Traditional authentication
   - Validates against backend API
   - JWT token generation

2. **Google OAuth**
   - Sign in with Google account
   - Redirects to onboarding wizard for first-time users
   - Automatic profile creation

### Session Management

- JWT-based authentication
- Secure session storage
- Automatic token refresh
- Session expiration handling

### Protected Routes

All dashboard routes require authentication:
```typescript
useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/auth/login");
  }
}, [status, router]);
```

---

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/onboarding` - Complete onboarding
- `GET /api/auth/session` - Get current session

### Partners

- `GET /api/partners` - Get all partners (admin only)
- `POST /api/partners/onboarding` - Complete partner onboarding

### Referrals

- `GET /api/referrals?partner_id={id}` - Get partner referrals
- `GET /api/referrals` - Get all referrals (admin only)
- `PUT /api/referrals/{id}` - Update referral status (admin only)

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

3. **Configure reverse proxy** (nginx example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email support@partnerflow.com or open an issue in the repository.

---

<div align="center">

**Built with ❤️ for Aice Tangerang Selatan**

[![Back to top](https://img.shields.io/badge/-Back%20to%20top-blue?style=flat)](#-partner-flow--referral-partners-platform)

</div>
