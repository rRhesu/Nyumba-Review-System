import Link from 'next/link'
import { House } from 'lucide-react'
import AuthForm from '@/components/auth-form'

export default function SignInPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-5 py-10"><section className="w-full max-w-md rounded-3xl border border-[#e0e5df] bg-white p-7 shadow-[0_16px_50px_rgba(42,62,52,.07)] sm:p-9"><Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-[-.04em] text-[#183d38]"><span className="flex size-9 items-center justify-center rounded-xl bg-[#183d38] text-[#f3c98b]"><House size={18} /></span>Nyumba<span className="text-[#b27643]">Review</span></Link><p className="mt-9 text-xs font-bold uppercase tracking-[.18em] text-[#b27643]">Welcome back</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.06em] text-[#183d38]">Sign in to explore homes</h1><p className="mt-3 text-sm leading-6 text-[#6d7470]">Create an account or sign in before browsing and reviewing houses.</p><div className="mt-7"><AuthForm mode="sign-in" /></div><p className="mt-6 text-center text-sm text-[#717975]">New to NyumbaReview? <Link href="/sign-up" className="font-semibold text-[#b27643]">Create an account</Link></p></section></main>
}
