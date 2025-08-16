import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { magicLink } from "better-auth/plugins";
import { sendMagicLink } from "@/actions/email"
import { admin as adminPlugin } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { ac, admin, user } from "@/lib/permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        sendMagicLink({ email, token, url })
      },
      storeToken: "plain"
    }),
    adminPlugin({
      ac,
      roles: {
        user,
        admin,
      }
    }),
    nextCookies()
  ],
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    }),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      },
    }),
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  rateLimit: {
    customRules: {
      "/sign-in/magic-link": {
        window: 120,
        max: 2,
      },
    },
  },
});

