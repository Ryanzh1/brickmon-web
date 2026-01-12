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
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={isPending}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
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
