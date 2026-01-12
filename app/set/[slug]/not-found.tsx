import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">Product Not Found</h1>
        <p className="mt-4 text-lg text-slate-400">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600"
        >
          View All Products
        </Link>
      </div>
    </main>
  )
}
