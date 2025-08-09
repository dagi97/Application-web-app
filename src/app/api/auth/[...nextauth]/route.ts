// NextAuth configuration and token refresh logic
import NextAuth, { AuthOptions, User, Account, Profile } from "next-auth"; 
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend User and JWT types to include tokens, role, rememberMe flag
export interface MyUser extends User {
  access: string;
  refresh: string;
  role: string;
  rememberMe?: boolean;
}

interface MyToken extends JWT {
  access?: string;
  refresh?: string;
  role?: string;
  email?: string; // user email
  rememberMe?: boolean;
  accessTokenExpires?: number; // timestamp when access token expires
  error?: string | null;
}

// Function to refresh access token using refresh token
async function refreshAccessToken(token: MyToken): Promise<MyToken> {
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
      throw data; // Refresh failed, will be caught below
    }

    return {
      ...token,
      access: data.access,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // new expiry 15 mins from now
      refresh: data.refresh ?? token.refresh, // update refresh token if new one provided
      error: null,
    };
  } catch (error) {
    console.error("Refresh token error", error);
    return {
      ...token,
      error: "RefreshAccessTokenError", // flag error to handle logout
    };
  }
}

export const authOptions: AuthOptions = {
  // Use CredentialsProvider to authenticate with email/password
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "boolean" }, // optional remember me checkbox
      },
      // Called when user submits login form
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

        // If login successful, return user object with tokens & role
        if (res.ok && data?.data?.access) {
          return {
            id: credentials?.email || "",
            email: credentials?.email,
            access: data.data.access,
            refresh: data.data.refresh,
            role: data.data.role,
            rememberMe: credentials?.rememberMe === "true" || false,
          };
        }
        // Return null if login failed
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt", // store session data in JWT tokens, not DB
  },

  callbacks: {
    // Runs whenever JWT is created or updated
    async jwt(params: {
      token: JWT;
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile;
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
      session?: any;
    }): Promise<JWT> {
      const { token, user } = params;

      // On first sign in, add tokens and role to JWT
      if (user) {
        const u = user as MyUser;
        return {
          ...token,
          access: u.access,
          refresh: u.refresh,
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 min expiry
          role: u.role,
          email: u.email ?? undefined,
          rememberMe: u.rememberMe ?? false,
          error: null,
        };
      }

      // If token is still valid, return it unchanged
      if (typeof token.accessTokenExpires === "number" && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Otherwise, token expired, try to refresh it
      return refreshAccessToken(token as MyToken);
    },

    // Customize session object sent to client
    async session({ session, token }) {
      session.user = {
        email: token.email ?? undefined,
        role: typeof token.role === "string" ? token.role : undefined,
      };
      (session as any).access = token.access ?? undefined;
      return session;
    },
  },

  // Configure session cookie security settings
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