import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:8080";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${backendUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        if (data.success) {
          return {
            id: data.data.user.id,
            email: data.data.user.email,
            name: data.data.user.name,
            role: data.data.user.role,
            admin_role: data.data.user.admin_role,
            partner_code: data.data.user.partner_code,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const res = await fetch(`${backendUrl}/api/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              oauth_sub: account.providerAccountId,
            }),
          });
          const data = await res.json();
          if (data.success) {
            const u = data.data.user;
            user.id = u.id;
            user.role = u.role;
            user.partner_code = u.partner_code;
            user.name = u.name ?? user.name;
            (user as { needsOnboarding?: boolean }).needsOnboarding =
              u.needs_onboarding ?? !u.partner_code;
          }
        } catch (e) {
          console.error("OAuth sync failed:", e);
        }
        if (!user.role) {
          user.role = "partner";
          (user as { needsOnboarding?: boolean }).needsOnboarding = true;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "partner";
        token.admin_role = (user as { admin_role?: string }).admin_role;
        token.partner_code = user.partner_code;
        token.needsOnboarding =
          (user as { needsOnboarding?: boolean }).needsOnboarding ??
          (user.role !== "admin" && !user.partner_code);
      }

      if (trigger === "update" && session) {
        const raw = session as Record<string, unknown>;
        const payload =
          (raw.user as Record<string, unknown> | undefined) ?? raw;

        if (typeof payload.id === "string") token.id = payload.id;
        if (typeof payload.role === "string") token.role = payload.role;
        if (typeof payload.partner_code === "string") {
          token.partner_code = payload.partner_code;
          token.needsOnboarding = false;
        }
        if (payload.needsOnboarding === false) {
          token.needsOnboarding = false;
        }
      }

      if (!token.role && token.partner_code) {
        token.role = "partner";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role =
          (token.role as string) || (token.partner_code ? "partner" : "partner");
        session.user.partner_code = token.partner_code as string | undefined;
        (session.user as { admin_role?: string }).admin_role =
          token.admin_role as string | undefined;
        (session.user as { needsOnboarding?: boolean }).needsOnboarding =
          Boolean(token.needsOnboarding) && !token.partner_code;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
