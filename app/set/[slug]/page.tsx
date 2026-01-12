import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Define the shape of our Product data
interface Product {
  id: string;
  name: string;
  price: string;
  status: string;
  buy_url: string;
  image_url: string;
  slug: string;
  description: string;
  retailer: string;
}

// 1. Generate Metadata for SEO (Dynamic Title)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!product) {
    return { title: 'Product Not Found | BrickMon' };
  }

  return {
    title: `Buy ${product.name} | Stock Checker`,
    description: product.description || `Check stock status for ${product.name}`,
  };
}

// 2. The Main Page Component
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  // Fetch exactly ONE product matching the slug
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single();

  // Handle 404s (Product not found)
  if (error || !product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 flex justify-center items-center">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: Image */}
        <div className="relative aspect-square w-full border border-slate-800 rounded-2xl overflow-hidden bg-slate-900">
          <Image 
            src={product.image_url} 
            alt={product.name}
            fill
            className="object-contain p-8"
          />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col justify-center space-y-6">
          
          {/* Status Badge */}
          <div className="w-fit">
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
              product.status === 'IN_STOCK' ? 'bg-green-500/20 text-green-400' :
              product.status === 'COMING_SOON' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {product.status.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {product.name}
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed">
            {product.description || "Track real-time availability for this set."}
          </p>

          <div className="text-3xl font-bold text-white">
            {product.price}
          </div>

          <a 
            href={product.buy_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-4 text-center rounded-lg font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]"
          >
            Check at {product.retailer || 'Retailer'}
          </a>
          
          <Link href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
            ← Back to all sets
          </Link>
        </div>
      </div>
    </div>
  );
}