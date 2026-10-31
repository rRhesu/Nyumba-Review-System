'use client'

import { FormEvent, useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle2, House, Send } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

const initialForm = { 
  landlordName: '', 
  email: '', 
  companyName: '', 
  propertyName: '', 
  location: '', 
  description: '', 
  units: '', 
  monthlyRent: '', 
  amenities: '' 
}

export default function LandlordsPage() {
  const { data: session } = authClient.useSession()
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Auto-fill the user's name and email when the session loads
  useEffect(() => {
    if (session?.user) {
      setForm((current) => ({
        ...current,
        landlordName: session.user.name || '',
        email: session.user.email || '',
      }))
    }
  }, [session])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    
    const response = await fetch('/api/listings', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(form) 
    })
    
    if (!response.ok) { 
      const result = await response.json()
      setError(result.error || 'Something went wrong.')
      setSaving(false)
      return 
    }
    
    setSubmitted(true)
    setSaving(false)
  }

  function update(key: keyof typeof form, value: string) { 
    setForm((current) => ({ ...current, [key]: value })) 
  }

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#252827]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="flex items-center gap-2 text-sm font-semibold text-[#183d38] hover:underline">
          <ArrowLeft size={17} /> Back to NyumbaReview
        </a>
        <span className="flex items-center gap-2 text-lg font-semibold tracking-[-.04em] text-[#183d38]">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#183d38] text-[#f3c98b]">
            <House size={18} />
          </span>
          Nyumba<span className="text-[#b27643]">Review</span>
        </span>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:px-8 lg:pt-16">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b27643]">Landlord portal</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] text-[#183d38] sm:text-6xl">Put your property on the map.</h1>
          <p className="mt-5 text-base leading-7 text-[#6d7470]">Share the details tenants need to find, compare, and confidently enquire about your building.</p>
        </div>

        {submitted ? (
          <div className="mt-10 rounded-3xl border border-[#d7e4d8] bg-[#eef5ee] p-8">
            <CheckCircle2 className="text-[#2e6457]" size={32} />
            <h2 className="mt-4 text-2xl font-semibold text-[#183d38]">Your property is in review.</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-[#617067]">
              Thanks for submitting your listing. Our team will review the details and contact you at {form.email}.
            </p>
            <a href="/" className="mt-6 inline-flex rounded-full bg-[#183d38] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0f2b27]">
              Browse homes
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 rounded-3xl border border-[#e0e5df] bg-white p-6 shadow-[0_16px_50px_rgba(42,62,52,.07)] sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              
              <label className="grid gap-2 text-sm font-semibold text-[#183d38]">
                Your name *
                <input 
                  required 
                  readOnly
                  value={form.landlordName} 
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-normal text-gray-500 outline-none cursor-not-allowed" 
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[#183d38]">
                Email address *
                <input 
                  required 
                  readOnly
                  type="email" 
                  value={form.email} 
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-normal text-gray-500 outline-none cursor-not-allowed" 
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[#183d38]">
                Company or agency
                <input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} className="rounded-xl border border-[#dce1dc] px-4 py-3 font-normal outline-none focus:border-[#b27643]" placeholder="Optional" />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[#183d38]">
                Property name *
                <input required value={form.propertyName} onChange={(e) => update('propertyName', e.target.value)} className="rounded-xl border border-[#dce1dc] px-4 py-3 font-normal outline-none focus:border-[#b27643]" placeholder="The Olive Courts" />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[#183d38]">
                Location *
                <input required value={form.location} onChange={(e) => update('location', e.target.value)} className="rounded-xl border border-[#dce1dc] px-4 py-3 font-normal outline-none focus:border-[#b27643]" placeholder="Kilimani, Nairobi" />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[#183d38]">
                Available units *
                <input required value={form.units} onChange={(e) => update('units', e.target.value)} className="rounded-xl border border-[#dce1dc] px-4 py-3 font-normal outline-none focus:border-[#b27643]" placeholder="1 beds: 4, 2 beds: 8" />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[#183d38]">
                Monthly rent *
                <input required value={form.monthlyRent} onChange={(e) => update('monthlyRent', e.target.value)} className="rounded-xl border border-[#dce1dc] px-4 py-3 font-normal outline-none focus:border-[#b27643]" placeholder="From KSh 35,000" />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[#183d38]">
                Amenities
                <input value={form.amenities} onChange={(e) => update('amenities', e.target.value)} className="rounded-xl border border-[#dce1dc] px-4 py-3 font-normal outline-none focus:border-[#b27643]" placeholder="Parking, lift, gym" />
              </label>
            </div>

            <label className="mt-5 grid gap-2 text-sm font-semibold text-[#183d38]">
              Describe the building and units *
              <textarea required value={form.description} onChange={(e) => update('description', e.target.value)} rows={5} className="resize-y rounded-xl border border-[#dce1dc] px-4 py-3 font-normal outline-none focus:border-[#b27643]" placeholder="Tell tenants what makes this property a great place to live..." />
            </label>

            {error && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{error}</p>}

            <button disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#183d38] px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-60 hover:bg-[#0f2b27]">
              {saving ? 'Submitting...' : 'Submit property'} <Send size={16} />
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
