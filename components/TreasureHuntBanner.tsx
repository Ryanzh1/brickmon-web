'use client'

import { useState, useEffect } from 'react'

export default function TreasureHuntBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('treasure-hunt-banner-dismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('treasure-hunt-banner-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <a
          href="https://www.brickfanatics.com/lego-pokemon-treasure-hunt-chance-win-prizes/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center gap-2 text-sm font-semibold text-gray-900 transition-opacity hover:opacity-80 sm:text-base"
        >
          <span className="text-lg">🏆</span>
          <span>
            <span className="font-bold">Contest Alert:</span> The Golden Brick Treasure Hunt has begun!{' '}
            <span className="underline">Read More →</span>
          </span>
        </a>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 rounded-full p-1 text-gray-900 transition-colors hover:bg-yellow-600/30 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:ring-offset-yellow-400"
          aria-label="Dismiss banner"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
