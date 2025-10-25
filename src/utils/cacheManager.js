// Utility to manage cache expiry
export const isCacheValid = (lastFetch, cacheExpiry) => {
  if (!lastFetch) return false
  const now = Date.now()
  return now - lastFetch < cacheExpiry
}

export const getCacheTimeRemaining = (lastFetch, cacheExpiry) => {
  if (!lastFetch) return 0
  const remaining = cacheExpiry - (Date.now() - lastFetch)
  return remaining > 0 ? remaining : 0
}
