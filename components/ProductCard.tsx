import Link from 'next/link'
import { Product } from '@/app/page'
import { generateSlug, parsePrice, getAvailability } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  getStatusColor: (status: string) => string
}

export default function ProductCard({ product, getStatusColor }: ProductCardProps) {
  const price = parsePrice(product.price)
  const availability = getAvailability(product.status)
  const productSlug = generateSlug(product.name)

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.image_url && { image: product.image_url }),
    ...(price !== null && {
      offers: {
        '@type': 'Offer',
        price: price.toString(),
        priceCurrency: 'USD',
        availability: availability,
        ...(product.buy_url && { url: product.buy_url }),
      },
    }),
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-primary/10">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col gap-4">
        <Link href={`/set/${productSlug}`} className="block">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-800">
            {product.image_url ? (
              <>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {/* TBC Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <span className="rounded-full bg-slate-900/90 px-4 py-2 text-sm font-bold text-yellow-400 border border-yellow-500/30">
                    TBC
                  </span>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 text-4xl">📦</div>
                  <span className="text-sm font-semibold text-slate-500">TBC</span>
                </div>
              </div>
            )}
          </div>
        </Link>
        <Link href={`/set/${productSlug}`} className="group/link">
          <h3 className="text-xl font-bold text-white transition-colors group-hover/link:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">
              TBC
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
  )
}
