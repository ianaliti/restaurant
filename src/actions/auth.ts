'use server'

import { cookies } from 'next/headers'
import type { User, UserRole } from '@/types/user.type'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const ROLE_MAP: Record<string, UserRole> = {
  USER: 'customer',
  RESTAURANT: 'restaurateur',
  ADMIN: 'admin',
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 7,
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
  const { token } = await res.json()
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, COOKIE_OPTIONS)
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
  const { token } = await res.json()
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, COOKIE_OPTIONS)
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
  cookieStore.delete('auth_token')
}

export async function getSessionAction(): Promise<{ user: User; token: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  try {
    const user = await buildUser(token)
    return { user, token }
  } catch {
    cookieStore.delete('auth_token')
    return null
  }
}
