'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20'
        : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          {/* Logo */}
          <Link href="/" className="group">
            <Logo />
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Beranda</Link>
            <Link href="#sekolah" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Untuk Sekolah</Link>
            <Link href="#siswa" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Untuk Siswa</Link>
          </div>

          {/* Tombol Aksi Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Hi, {user.name}</span>
                <Link
                  href={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'}
                  className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-100 font-medium transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar-sekolah"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Daftar Sekolah
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t p-4 shadow-xl flex flex-col space-y-4 animate-fade-in">
          <Link
            href="/"
            className="text-lg font-medium text-gray-700 py-2 border-b border-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Beranda
          </Link>
          <Link
            href="#sekolah"
            className="text-lg font-medium text-gray-700 py-2 border-b border-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Untuk Sekolah
          </Link>
          <Link
            href="#siswa"
            className="text-lg font-medium text-gray-700 py-2 border-b border-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Untuk Siswa
          </Link>
          <div className="flex flex-col gap-3 pt-2">
            {user ? (
              <Link
                href={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'}
                className="bg-primary-50 text-primary-700 px-4 py-3 rounded-xl font-bold text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-gray-100 text-gray-800 px-4 py-3 rounded-xl font-bold text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar-sekolah"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Daftar Sekolah
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}