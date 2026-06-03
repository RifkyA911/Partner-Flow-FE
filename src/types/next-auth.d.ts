import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      partner_code?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    partner_code?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    partner_code?: string;
  }
}
