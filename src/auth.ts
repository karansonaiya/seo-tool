import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models";

/**
 * Full auth config — Node.js runtime only.
 * Extends the Edge-safe authConfig with a signIn callback
 * that upserts the user in MongoDB.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,

    /**
     * signIn: runs in the Node.js API route after Google OAuth callback.
     * Creates or updates the user record in MongoDB.
     */
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          await connectDB();
          await User.findOneAndUpdate(
            { email: user.email },
            {
              $setOnInsert: {
                plan: "free",
                auditsThisMonth: 0,
                maxAuditsPerMonth: 5,
              },
              $set: {
                name: user.name ?? "User",
                image: user.image ?? "",
                googleId: account.providerAccountId,
              },
            },
            { upsert: true, new: true }
          );
        } catch (err) {
          console.error("[Auth] MongoDB user upsert failed:", err);
          // Don't block sign-in on DB errors
        }
      }
      return true;
    },
  },
});
