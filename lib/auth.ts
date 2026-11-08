import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

export const auth = betterAuth({
  database: pool,
  
  // This allows Better Auth to dynamically match the current Vercel URL
  baseURL: {
    allowedHosts: [
      "localhost:3000",
      "nyumba-review-system-8mtq.vercel.app",
      "*.vercel.app", // Allows all preview deployments
    ],
    protocol: process.env.NODE_ENV === "development" ? "http" : "https",
  },

  emailAndPassword: { enabled: true, autoSignIn: true },
  
  // Trust the main site and any Vercel preview URLs
  trustedOrigins: [
    "http://localhost:3000",
    "https://nyumba-review-system-8mtq.vercel.app",
    "https://*.vercel.app",
  ],

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'renter',
        input: false,
      },
    },
  },

  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: 'lax' as const,
            secure: false,
          },
        },
      }
    : {}),
})
