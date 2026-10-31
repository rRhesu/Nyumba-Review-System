import Link from 'next/link'
import { House } from 'lucide-react'
import AuthForm from '@/components/auth-form'

export default function SignUpPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-5 py-10"><section className="w-full max-w-md rounded-3xl border border-[#e0e5df] bg-white p-7 shadow-[0_16px_50px_rgba(42,62,52,.07)] sm:p-9"><Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-[-.04em] text-[#183d38]"><span className="flex size-9 items-center justify-center rounded-xl bg-[#183d38] text-[#f3c98b]"><House size={18} /></span>Nyumba<span className="text-[#b27643]">Review</span></Link><p className="mt-9 text-xs font-bold uppercase tracking-[.18em] text-[#b27643]">Join the community</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.06em] text-[#183d38]">Create your account</h1><p className="mt-3 text-sm leading-6 text-[#6d7470]">Your account keeps reviews tied to real tenants and protects the community.</p><div className="mt-7"><AuthForm mode="sign-up" /></div><p className="mt-6 text-center text-sm text-[#717975]">Already have an account? <Link href="/sign-in" className="font-semibold text-[#b27643]">Sign in</Link></p></section></main>
}
