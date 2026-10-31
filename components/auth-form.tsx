'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password })
    setPending(false)
    if (result.error) {
      setError('We could not complete that request. Check your details and try again.')
      return
    }
    router.push('/')
    router.refresh()
  }

  return <form onSubmit={submit} className="grid gap-4">
    {isSignUp && <label className="grid gap-2 text-sm font-semibold text-[#183d38]">Full name<input required value={name} onChange={(event) => setName(event.target.value)} className="rounded-xl border border-[#dce1dc] bg-white px-4 py-3 font-normal outline-none focus:border-[#b27643]" /></label>}
    <label className="grid gap-2 text-sm font-semibold text-[#183d38]">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-[#dce1dc] bg-white px-4 py-3 font-normal outline-none focus:border-[#b27643]" /></label>
    <label className="grid gap-2 text-sm font-semibold text-[#183d38]">Password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-[#dce1dc] bg-white px-4 py-3 font-normal outline-none focus:border-[#b27643]" /><span className="font-normal text-xs text-[#89928b]">Use at least 8 characters.</span></label>
    {error && <p role="alert" className="rounded-xl bg-[#fff1eb] px-4 py-3 text-sm text-[#a64d32]">{error}</p>}
    <button disabled={pending} className="rounded-xl bg-[#183d38] py-3.5 text-sm font-semibold text-white disabled:opacity-60">{pending ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}</button>
  </form>
}
