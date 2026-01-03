'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'school_admin' | 'student'
  school_id?: number
  school?: {  // ← TAMBAH INI
    id: number
    name: string
    email: string
    phone?: string
    address?: string
    status: string
    registration_link?: string
    verified_at?: string
    created_at: string
    updated_at: string
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load saved session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('yuksekolah_token')
    const savedUser = localStorage.getItem('yuksekolah_user')

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
      } catch (e) {
        // Clear invalid session data
        localStorage.removeItem('yuksekolah_token')
        localStorage.removeItem('yuksekolah_user')
        setToken(null)
        setUser(null)
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        let errorMessage = 'Login failed'
        const text = await response.text() // Read once
        try {
          const errorData = JSON.parse(text)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error('Login Error (Non-JSON):', text)
          errorMessage = `Server Error (${response.status}): Cek konsol browser untuk detail.`
        }
        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      // Structure from Next.js API: { message, token, user }
      const { user, token } = responseData

      // Save to state
      setUser(user)
      setToken(token)

      // Save to localStorage
      localStorage.setItem('yuksekolah_token', token)
      localStorage.setItem('yuksekolah_user', JSON.stringify(user))

      // Redirect based on role
      if (user.role === 'school_admin') {
        router.push('/admin/dashboard')
      } else if (user.role === 'student') {
        router.push('/student/dashboard')
      } else if (user.role === 'super_admin') {
        router.push('/super-admin/dashboard')
      } else {
        router.push('/')
      }

    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Call logout API to clear cookies
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }

    // Clear state
    setUser(null)
    setToken(null)

    // Clear localStorage
    localStorage.removeItem('yuksekolah_token')
    localStorage.removeItem('yuksekolah_user')

    // Redirect to home
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}