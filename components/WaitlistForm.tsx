'use client'

import { useState, useTransition } from 'react'
import { subscribeToWaitlist, type WaitlistActionState } from '@/app/actions'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<WaitlistActionState>({ success: false, message: '' })
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('email', email)

    startTransition(async () => {
      const result = await subscribeToWaitlist(null, formData)
      setState(result)
      if (result.success) {
        setEmail('')
      }
    })
  }

  // If successful, show success message and hide form
  if (state.success) {
    return (
      <div className="mx-auto mt-10 max-w-md">
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
          <p className="text-lg font-semibold text-green-400">{state.message}</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-lg">
      <div className="flex gap-3 rounded-xl border border-slate-700/50 bg-slate-900/80 p-1 shadow-lg shadow-primary/10 backdrop-blur-sm">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={isPending}
          className="flex-1 rounded-lg border-0 bg-transparent px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-0 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-8 py-4 font-semibold text-white shadow-md shadow-primary/30 transition-all hover:bg-red-600 hover:shadow-lg hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Joining...' : 'Join the Waitlist'}
        </button>
      </div>
      {state.message && !state.success && (
        <p className="mt-3 text-sm text-red-400">{state.message}</p>
      )}
    </form>
  )
}
