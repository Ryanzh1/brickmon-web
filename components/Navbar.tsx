'use client'

export default function Navbar() {
  return (
    <nav className="w-full border-b border-slate-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="font-blocky text-2xl font-black tracking-tight">
              <span className="text-white">Brick</span>
              <span className="text-primary">Mon</span>
            </h1>
          </div>

          {/* Live Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </div>
            <span className="text-sm font-medium text-slate-300">System Online</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
