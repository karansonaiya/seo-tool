import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe auth config — NO Node.js-only imports (mongoose, etc.).
 * Used by middleware.ts (Edge runtime) and extended by auth.ts (Node.js).
 */
export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    /**
     * authorized: used by middleware to gate protected routes.
     * Returns true if the user has a valid session.
     */
    authorized({ auth }) {
      return !!auth?.user;
    },

    /**
     * jwt: builds/updates the JWT.
     * The remember-me logic runs ONLY on trigger==="signIn"
     * (i.e. in the Node.js API route — never in Edge middleware).
     */
    async jwt({ token, user, account, trigger }) {
      if (trigger === "signIn" && account) {
        if (user?.id) token.id = user.id;

        try {
          // cookies() is only available in Node.js API route context —
          // this block never runs in Edge because trigger!=="signIn" there.
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const rememberRaw = cookieStore.get("seo_rm")?.value;
          const rememberMe = rememberRaw !== "0";

          token.rememberMe = rememberMe;
          if (!rememberMe) {
            token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 1 day
          }
        } catch {
          token.rememberMe = true; // default to 30 days if cookie unavailable
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (typeof token.rememberMe === "boolean") {
        session.user.rememberMe = token.rememberMe;
      }
      return session;
    },
  },
};
