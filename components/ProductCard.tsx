import { Product } from '@/app/page'

interface ProductCardProps {
  product: Product
  getStatusColor: (status: string) => string
}

export default function ProductCard({ product, getStatusColor }: ProductCardProps) {
  // Parse price from string (e.g., "$99.99" -> 99.99)
  const parsePrice = (priceString: string | null): number | null => {
    if (!priceString || priceString === 'TBA') return null
    const match = priceString.match(/[\d.]+/)
    return match ? parseFloat(match[0]) : null
  }

  // Map status to schema.org availability
  const getAvailability = (status: string): string => {
    const upperStatus = status.toUpperCase()
    if (upperStatus.includes('IN STOCK') || upperStatus.includes('AVAILABLE')) {
      return 'https://schema.org/InStock'
    }
    if (upperStatus.includes('OUT OF STOCK') || upperStatus.includes('OUT OF STOCK')) {
      return 'https://schema.org/OutOfStock'
    }
    if (upperStatus.includes('COMING SOON') || upperStatus.includes('SOON')) {
      return 'https://schema.org/PreOrder'
    }
    return 'https://schema.org/OutOfStock'
  }

  const price = parsePrice(product.price)
  const availability = getAvailability(product.status)

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
  )
}
