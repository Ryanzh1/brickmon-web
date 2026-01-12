export const dynamic = 'force-dynamic'
export const revalidate = 0

import { supabase } from '@/lib/supabase'
import WaitlistForm from '@/components/WaitlistForm'
import ProductCard from '@/components/ProductCard'
import LiveStatsBar from '@/components/LiveStatsBar'
import FAQSection from '@/components/FAQSection'

export interface Product {
  id: number
  name: string
  status: string
  price: string | null
  retailer: string | null
  image_url: string | null
  buy_url: string | null
  description?: string | null
}

const getStatusColor = (status: string) => {
  const upperStatus = status.toUpperCase()
  if (upperStatus.includes('COMING SOON') || upperStatus.includes('SOON')) {
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  }
  if (upperStatus.includes('OUT OF STOCK') || upperStatus.includes('OUT OF STOCK')) {
    return 'bg-red-500/20 text-red-400 border-red-500/30'
  }
  if (upperStatus.includes('IN STOCK') || upperStatus.includes('AVAILABLE')) {
    return 'bg-green-500/20 text-green-400 border-green-500/30'
  }
  // Default fallback
  return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
}

export default async function Home() {
  let products: Product[] = []
  let error: string | null = null

  try {
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('id')

    if (fetchError) {
      error = fetchError.message
    } else {
      products = data || []
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch products'
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        {/* Radial gradient background glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]" />
        
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-blocky text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-r from-primary via-red-500 to-secondary bg-clip-text text-transparent">
              Gotta Build &apos;Em All.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-gray-400">
            Real-time stock tracking for the newly announced collaboration.
          </p>

          {/* Waitlist Form */}
          <WaitlistForm />
        </div>
      </section>

      {/* Live Stats Bar */}
      <LiveStatsBar />

      {/* Product Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {error ? (
            <div className="text-center">
              <p className="text-lg text-slate-400">Unable to load products. Please try again later.</p>
              <p className="mt-2 text-sm text-slate-500">Error: {error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-lg text-slate-400">Loading System...</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} getStatusColor={getStatusColor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
    </main>
  )
}
