// Token lives in memory only — never persisted to localStorage.
// Populated by AuthProvider after login/register/session restore.
// Cleared on logout or page unload.
let memoryToken: string | null = null

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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }
  if (memoryToken) {
    headers['Authorization'] = `Bearer ${memoryToken}`
  }
  return fetch(apiUrl(path), { ...options, headers })
}
