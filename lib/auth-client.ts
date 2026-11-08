'use client'

import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  // Use the env variable so it works on both localhost and Vercel
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
})

export const { signIn, signUp, signOut, useSession } = authClient
