/**
 * Generate a URL-friendly slug from a product name
 * Example: "LEGO Charizard (Flame Edition)" -> "lego-charizard"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100) // Limit length
}

/**
 * Parse price from string (e.g., "$99.99" -> 99.99)
 */
export function parsePrice(priceString: string | null): number | null {
  if (!priceString || priceString === 'TBA') return null
  const match = priceString.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : null
}

/**
 * Map status to schema.org availability
 */
export function getAvailability(status: string): string {
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
