import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      nickname: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    nickname: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    nickname: string | null;
  }
} 