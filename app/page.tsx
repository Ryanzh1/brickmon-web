import { supabase } from '@/lib/supabase'
import WaitlistForm from '@/components/WaitlistForm'

export interface Product {
  id: number
  name: string
  status: string
  price: string | null
  retailer: string | null
  image_url: string | null
  buy_url: string | null
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
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-blocky text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Gotta Build &apos;Em All.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Real-time stock tracking for the newly announced collaboration.
          </p>

          {/* Waitlist Form */}
          <WaitlistForm />
        </div>
      </section>

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
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex flex-col gap-4">
                    {product.image_url && (
                      <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-800">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">
                          {product.price || 'TBA'}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${getStatusColor(product.status)}`}
                        >
                          {product.status}
                        </span>
                      </div>
                      {product.retailer && (
                        <p className="text-sm text-slate-400">Retailer: {product.retailer}</p>
                      )}
                      {product.buy_url && (
                        <a
                          href={product.buy_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 text-center"
                        >
                          Buy Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
