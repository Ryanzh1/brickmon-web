export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800 bg-slate-900/50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Copyright */}
          <p className="text-sm text-slate-400">
            © {currentYear} BrickMon. All rights reserved.
          </p>

          {/* Affiliate Disclaimer */}
          <p className="text-xs text-slate-500 max-w-3xl">
            BrickMon is a participant in the Amazon Services LLC Associates Program and the LEGO Affiliate Program. As an Amazon Associate, we earn from qualifying purchases.
          </p>
        </div>
      </div>
    </footer>
  )
}
