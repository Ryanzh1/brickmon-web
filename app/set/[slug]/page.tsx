export const dynamic = 'force-dynamic'
export const revalidate = 0

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generateSlug, parsePrice, getAvailability } from '@/lib/utils'
import type { Product } from '@/app/page'
import Link from 'next/link'

interface PageProps {
  params: {
    slug: string
  }
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select('*').execute()

  if (error || !data) return null

  // Find product by matching slug
  const product = data.find((p) => generateSlug(p.name) === slug)
  return product || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found | BrickMon',
    }
  }

  const description = `Check stock status and pricing for ${product.name}. ${product.retailer ? `Available at ${product.retailer}.` : ''} Real-time inventory tracking.`

  return {
    title: `Buy ${product.name} | Stock Checker | BrickMon`,
    description,
    openGraph: {
      title: `Buy ${product.name} | BrickMon`,
      description,
      type: 'website',
      ...(product.image_url && { images: [{ url: product.image_url }] }),
    },
  }
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
  return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const price = parsePrice(product.price)
  const availability = getAvailability(product.status)

  // Generate JSON-LD structured data for this specific product
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.image_url && { image: product.image_url }),
    ...(product.description && { description: product.description }),
    ...(price !== null && {
      offers: {
        '@type': 'Offer',
        price: price.toString(),
        priceCurrency: 'USD',
        availability: availability,
        ...(product.buy_url && { url: product.buy_url }),
        ...(product.retailer && { seller: { '@type': 'Organization', name: product.retailer } }),
      },
    }),
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-slate-400 transition-colors hover:text-white"
        >
          ← Back to All Products
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Product Image */}
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-800">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                No Image Available
              </div>
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl">{product.name}</h1>
              {product.retailer && (
                <p className="mt-2 text-lg text-slate-400">Available at {product.retailer}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <p className="text-sm text-slate-400">Price</p>
              <p className="text-5xl font-black text-white">
                {product.price || 'TBA'}
              </p>
            </div>

            {/* Stock Status */}
            <div>
              <p className="mb-2 text-sm text-slate-400">Stock Status</p>
              <span
                className={`inline-block rounded-full border px-4 py-2 text-sm font-semibold uppercase ${getStatusColor(product.status)}`}
              >
                {product.status}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <p className="mb-2 text-sm text-slate-400">Description</p>
                <p className="text-slate-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Buy Now Button */}
            {product.buy_url && (
              <a
                href={product.buy_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-lg bg-primary px-8 py-4 text-center text-lg font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-red-600 hover:shadow-xl hover:shadow-primary/40"
              >
                Buy Now →
              </a>
            )}
          </div>
        </div>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </main>
  )
}
