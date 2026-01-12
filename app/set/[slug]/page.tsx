import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0; // Disable cache for real-time stock status

export default async function Home() {
  const supabase = createClient();
  
  // Fetch all products, ordered by "In Stock" first, then "Coming Soon"
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('status', { ascending: true }); // A-Z sort works for statuses (Coming Soon > In Stock > Out) roughly

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-red-500/30">
      
      {/* 1. News Banner */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-center py-2 px-4 text-sm font-bold tracking-wide">
        🏆 <span className="hidden sm:inline">Treasure Hunt Alert:</span> The Golden Brick Hunt is live! <a href="https://www.brickfanatics.com" target="_blank" className="underline hover:text-white transition-colors">Find Clues & Win →</a>
      </div>

      {/* 2. Hero Section */}
      <div className="relative border-b border-slate-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pt-20 pb-24 text-center">
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
          Gotta Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">'Em All.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          The only real-time stock tracker for the LEGO® Pokémon collaboration.
          <br className="hidden sm:block"/> Stop refreshing. Start building.
        </p>

        {/* Live Stats Pills */}
        <div className="mt-8 flex justify-center gap-4 text-sm font-medium text-slate-400">
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            System Online
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-4 py-1.5">
            📦 {products?.length || 0} Sets Tracked
          </div>
        </div>
      </div>

      {/* 3. The Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <Link 
              href={`/set/${product.slug || '#'}`} 
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 transition-all hover:border-slate-700 hover:bg-slate-900"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-700">No Image</div>
                )}
                
                {/* Status Badge (Top Right) */}
                <div className="absolute right-3 top-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                    product.status === 'IN_STOCK' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    product.status === 'COMING_SOON' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {product.status === 'IN_STOCK' ? '● IN STOCK' : 
                     product.status === 'COMING_SOON' ? '○ COMING SOON' : '○ OUT OF STOCK'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-slate-400 text-sm">{product.retailer}</p>
                  <p className="font-mono text-white">{product.price}</p>
                </div>
                
                {/* CTA Button */}
                <div className="mt-6">
                  <span className="block w-full rounded-lg bg-slate-800 py-2.5 text-center text-sm font-semibold text-white transition-colors group-hover:bg-red-600">
                    Check Status
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Footer */}
      <footer className="border-t border-slate-800 py-12 text-center text-slate-600">
        <p className="text-sm">BrickMon is a fan-made tracker. Not affiliated with The LEGO Group or The Pokémon Company.</p>
        <p className="mt-2 text-xs">
          Participant in the Amazon Services LLC Associates Program. We earn from qualifying purchases.
        </p>
      </footer>
    </main>
  );
}