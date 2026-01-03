'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, Lock, Mail, AlertTriangle, ArrowRight } from 'lucide-react'
import Logo from '../components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      // Redirect handled by AuthContext
    } catch (err: any) {
      setError(err.message || 'Email atau password salah')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/grid-pattern.svg')] bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 opacity-90 -z-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-[100px] -z-10 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-200/30 rounded-full blur-[100px] -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Back Link */}
        <div className="animate-fade-in-up">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-6 transition-colors group bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-sm hover:shadow-md">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/50 animate-fade-in-up animation-delay-300 relative overflow-hidden">
          {/* Decorative Top Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-blue-500 to-secondary-500"></div>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo className="scale-125" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Masuk untuk mengelola pendaftaran sekolah Anda
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake flex items-start shadow-sm">
                <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium"
                    placeholder="nama@sekolah.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative group">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/lupa-password"
                  className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Lupa password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-blue-500/30"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Masuk Sekarang
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm mb-4">
                Belum punya akun sekolah?
              </p>
              <Link
                href="/daftar-sekolah"
                className="inline-block w-full py-3.5 px-4 border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-bold rounded-xl transition-all duration-200"
              >
                Daftarkan Sekolah Baru
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} YukSekolah. All rights reserved.
        </p>
      </div>
    </div>
  )
}