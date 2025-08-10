import "next-auth/jwt";
import "next-auth";



declare module "next-auth/jwt" {
  interface JWT {
    access?: string;
    error?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string | null;

    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // Add role here
    };
  }
}