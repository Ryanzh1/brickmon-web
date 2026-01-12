'use client'

import { useState } from 'react'

interface ProductCard {
  name: string
  price: string
  status: 'COMING SOON' | 'OUT OF STOCK' | 'IN STOCK'
}

const products: ProductCard[] = [
  {
    name: 'Kanto Region Interactive Set',
    price: '$TBA',
    status: 'COMING SOON',
  },
  {
    name: 'Life-Size Pikachu',
    price: '$99.99',
    status: 'OUT OF STOCK',
  },
  {
    name: 'Eevee Evolution Pack',
    price: '$49.99',
    status: 'IN STOCK',
  },
]

const getStatusColor = (status: ProductCard['status']) => {
  switch (status) {
    case 'COMING SOON':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'OUT OF STOCK':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'IN STOCK':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
  }
}

export default function Home() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Hook up to Supabase
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-blocky text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Gotta Build &apos;Em All.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Real-time stock tracking for the newly announced collaboration.
          </p>

          {/* Waitlist Form */}
          <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                Join the Waitlist
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">{product.price}</span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${getStatusColor(product.status)}`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
