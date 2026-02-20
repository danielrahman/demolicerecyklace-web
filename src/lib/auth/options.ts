import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { AdminRole } from "@/lib/types";
import { db } from "@/server/db/client";
import { adminUsers } from "@/server/db/schema";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/prihlaseni",
  },
  providers: [
    CredentialsProvider({
      name: "Admin login",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Heslo", type: "password" },
      },
      async authorize(credentials) {
        const email = normalizeEmail(credentials?.email ?? "");
        const password = credentials?.password ?? "";

        if (!email || !password) {
          return null;
        }

        const [adminUser] = await db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.email, email))
          .limit(1);

        if (!adminUser || !adminUser.active) {
          return null;
        }

        const validPassword = await compare(password, adminUser.passwordHash);
        if (!validPassword) {
          return null;
        }

        return {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role as AdminRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as AdminRole | undefined) ?? "operator";
      }
      return session;
    },
  },
};
