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
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "partner";
        token.partner_code = user.partner_code;
        token.needsOnboarding =
          (user as { needsOnboarding?: boolean }).needsOnboarding ??
          (user.role === "partner" && !user.partner_code);
      }
      if (trigger === "update" && session) {
        const s = session as {
          partner_code?: string;
          id?: string;
          role?: string;
        };
        if (s.partner_code) token.partner_code = s.partner_code;
        if (s.id) token.id = s.id;
        if (s.role) token.role = s.role;
        if (s.partner_code) token.needsOnboarding = false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "partner";
        session.user.partner_code = token.partner_code as string | undefined;
        (session.user as { needsOnboarding?: boolean }).needsOnboarding =
          token.needsOnboarding as boolean;
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
});
