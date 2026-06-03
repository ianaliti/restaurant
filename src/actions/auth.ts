'use server'

import { cookies } from 'next/headers'
import type { User, UserRole } from '@/types/user.type'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const ROLE_MAP: Record<string, UserRole> = {
  USER: 'customer',
  RESTAURANT: 'restaurateur',
  ADMIN: 'admin',
}

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 15, // 15 minutes — matches JWT expiry
  path: '/',
}

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
}

async function fetchProfile(role: string, token: string): Promise<{ name: string; createdAt: string }> {
  const endpoint = role === 'USER' ? '/api/users/me' : role === 'RESTAURANT' ? '/api/restaurants/me' : null
  if (!endpoint) return { name: '', createdAt: '' }
  try {
    const res = await fetch(`${BACKEND}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      return { name: data.name || '', createdAt: data.createdAt || '' }
    }
  } catch {}
  return { name: '', createdAt: '' }
}

async function buildUser(token: string): Promise<User> {
  const res = await fetch(`${BACKEND}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch user info')
  const auth = await res.json()
  const profile = await fetchProfile(auth.role, token)
  return {
    id: auth.id,
    email: auth.email,
    name: profile.name || auth.email.split('@')[0],
    role: ROLE_MAP[auth.role] ?? 'customer',
    createdAt: profile.createdAt || new Date().toISOString(),
  }
}

async function doRefresh(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
  const res = await fetch(`${BACKEND}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) throw new Error('Refresh failed')
  return res.json()
}

export async function loginAction(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await fetch(`${BACKEND}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Invalid credentials')
  }
  const { token, refreshToken } = await res.json()
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, ACCESS_COOKIE_OPTIONS)
  cookieStore.set('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS)
  const user = await buildUser(token)
  return { user, token }
}

export async function registerAction(
  email: string,
  password: string,
  name: string
): Promise<{ user: User; token: string }> {
  const res = await fetch(`${BACKEND}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Registration failed')
  }
  const { token, refreshToken } = await res.json()
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, ACCESS_COOKIE_OPTIONS)
  cookieStore.set('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS)
  if (name) {
    await fetch(`${BACKEND}/api/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name }),
    }).catch(() => {})
  }
  const user = await buildUser(token)
  return { user, token }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value
  if (refreshToken) {
    await fetch(`${BACKEND}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {})
  }
  cookieStore.delete('auth_token')
  cookieStore.delete('refresh_token')
}

// Called by apiClient when an API request returns 401.
// Returns the new access token, or null if the session cannot be recovered.
export async function refreshSessionAction(): Promise<string | null> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value
  if (!refreshToken) return null
  try {
    const { token, refreshToken: newRefreshToken } = await doRefresh(refreshToken)
    cookieStore.set('auth_token', token, ACCESS_COOKIE_OPTIONS)
    cookieStore.set('refresh_token', newRefreshToken, REFRESH_COOKIE_OPTIONS)
    return token
  } catch {
    cookieStore.delete('auth_token')
    cookieStore.delete('refresh_token')
    return null
  }
}

export async function getSessionAction(): Promise<{ user: User; token: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (token) {
    try {
      const user = await buildUser(token)
      return { user, token }
    } catch {}
    // Access token present but invalid/expired — fall through to refresh
  }

  const storedRefreshToken = cookieStore.get('refresh_token')?.value
  if (!storedRefreshToken) {
    cookieStore.delete('auth_token')
    return null
  }

  try {
    const { token: newToken, refreshToken: newRefreshToken } = await doRefresh(storedRefreshToken)
    cookieStore.set('auth_token', newToken, ACCESS_COOKIE_OPTIONS)
    cookieStore.set('refresh_token', newRefreshToken, REFRESH_COOKIE_OPTIONS)
    const user = await buildUser(newToken)
    return { user, token: newToken }
  } catch {
    cookieStore.delete('auth_token')
    cookieStore.delete('refresh_token')
    return null
  }
}
