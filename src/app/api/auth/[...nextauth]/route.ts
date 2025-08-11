import NextAuth, { AuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

interface MyUser extends User {
  access: string;
  refresh: string;
  role: string;
}

interface MyToken extends JWT {
  access?: string;
  refresh?: string;
  role?: string;
  email?: string;
  error?: string | null;
  accessTokenExpires?: number;
}

const TOKEN_LIFETIME = 15 * 60 * 1000;

async function refreshAccessToken(token: MyToken): Promise<MyToken> {
  console.log("Refreshing token with refresh:", token.refresh);
  if (!token.refresh) {
    console.error("No refresh token available!");
    return {
      ...token,
      access: undefined,
      refresh: undefined,
      error: "RefreshAccessTokenError",
    };
  }

  try {
    const res = await fetch(
      "https://a2sv-application-platform-backend-team2.onrender.com/auth/token/refresh/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: token.refresh }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    return {
      ...token,
      access: data.access,
      accessTokenExpires: Date.now() + TOKEN_LIFETIME,
      error: null,
    };
  } catch (error) {
    console.error("Refresh token error", error);
    return {
      ...token,
      access: undefined,
      refresh: undefined,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("Storing tokens on sign in:", user.access, user.refresh);
        return {
          ...token,
          access: user.access,
          refresh: user.refresh,
          role: user.role,
          email: user.email,
          name: user.name,
          accessTokenExpires: Date.now() + TOKEN_LIFETIME,
          error: null,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token expired, try to refresh it
      if (token.error === "RefreshAccessTokenError") {
        // If refresh failed before, don't retry endlessly
        return token;
      }

      // Refresh access token
      return await refreshAccessToken(token as MyToken);
    },

    async session({ session, token }) {
      session.user = {
        ...(session.user || {}),
        email: token.email ?? undefined,
        role: typeof token.role === "string" ? token.role : undefined,
      };
      if (typeof token.name === "string") {
        (session.user as any).name = token.name;
      }
      (session as any).access = token.access ?? undefined;
      (session as any).error = token.error ?? null;
      return session;
    },
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
