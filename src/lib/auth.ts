import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            "https://a2sv-application-platform-backend-team2.onrender.com/auth/token/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          const data = await res.json();

          if (res.ok && data?.data?.access) {
            return {
              id: credentials?.email || "",
              email: credentials?.email,
              access: data.data.access,
              refresh: data.data.refresh,
              role: data.data.role,
              name: data.data.full_name || undefined,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          access: user.access,
          refresh: user.refresh,
          role: user.role,
          email: user.email,
          name: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user || {}),
        email: token.email ?? undefined,
        role: typeof token.role === "string" ? token.role : undefined,
      };
      (session as any).access = token.access ?? undefined;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
};
