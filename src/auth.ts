import NextAuth, { NextAuthConfig, User } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
      role: UserRole;
    };
  }
}

const options: NextAuthConfig = {
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [Google, GitHub],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(options);
