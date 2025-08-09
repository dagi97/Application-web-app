import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    access?: string;
    error?: string | null;
    maxAge?: number;
    user: {
      email?: string;
      role?: string;
    };
  }

  interface User {
    access?: string;
    refresh?: string;
    role?: string;
    rememberMe?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string | null; // allow null
    access?: string;
    refresh?: string;
    role?: string;
    rememberMe?: boolean;
    accessTokenExpires?: number;
    error?: string | null;
  }
}
