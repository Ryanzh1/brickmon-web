export default function LiveStatsBar() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/30 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/50 px-4 py-2">
            <span className="text-lg">🟢</span>
            <span className="text-sm font-medium text-slate-300">System Online</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/50 px-4 py-2">
            <span className="text-lg">📦</span>
            <span className="text-sm font-medium text-slate-300">3 Sets Tracked</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800/50 px-4 py-2">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-medium text-slate-300">1,200+ Fans Waiting</span>
          </div>
        </div>
      </div>
    </section>
  )
}
