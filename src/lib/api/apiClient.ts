// Token lives in memory only — never persisted to localStorage.
// Populated by AuthProvider after login/register/session restore.
// Cleared on logout or page unload.
let memoryToken: string | null = null

// Deduplicates concurrent refresh calls: if two requests get 401 at the same
// time, only one refresh is fired; both then retry with the new token.
let refreshPromise: Promise<string | null> | null = null

export const setMemoryToken = (token: string | null): void => {
  memoryToken = token
}

export const getMemoryToken = (): string | null => memoryToken

const getApiBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const apiUrl = (path: string): string => `${getApiBase()}${path}`

export const apiFetch = async (
  path: string,
  options: RequestInit = {}
): Promise<Response> => {
  const { refreshSessionAction } = await import('@/actions/auth')

  const buildHeaders = (token: string | null): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  })

  const response = await fetch(apiUrl(path), { ...options, headers: buildHeaders(memoryToken) })

  if (response.status !== 401 || !memoryToken) {
    return response
  }

  // Token expired — refresh once, deduplicated across concurrent callers
  if (!refreshPromise) {
    refreshPromise = refreshSessionAction()
      .then((token) => {
        if (token) setMemoryToken(token)
        return token
      })
      .finally(() => { refreshPromise = null })
  }

  const newToken = await refreshPromise
  if (!newToken) return response // refresh failed — caller receives the 401

  return fetch(apiUrl(path), { ...options, headers: buildHeaders(newToken) })
}
