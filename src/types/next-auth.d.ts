import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      partner_code?: string;
      needsOnboarding?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    partner_code?: string;
    needsOnboarding?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    partner_code?: string;
    id?: string;
    needsOnboarding?: boolean;
  }
}
