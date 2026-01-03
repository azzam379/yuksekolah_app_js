'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Users, UserPlus, FileText, Calendar, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  stats: {
    total_registrations: number
    pending_verification: number
    verified: number
    today_registrations: number
  }
  school_info?: {
    id: number
    name: string
    registration_link: string
  }
  recent_registrations: any[]
}

export default function SchoolAdminDashboard() {
  const { user, token } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/dashboard/school-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [token])

  // Helper to get registration link
  const getRegistrationLink = () => {
    const link = data?.school_info?.registration_link;
    if (!link) return '';

    let token = link;
    // If it looks like a URL, extract the last part
    if (link.includes('/')) {
      const parts = link.split('/');
      token = parts[parts.length - 1];
    }

    // Construct full URL using current origin
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/register/${token}`;
    }
    return '';
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Memuat data sekolah...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header Section */}
      <div className="mb-8 p-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Dashboard Sekolah
            </h1>
            <p className="text-gray-600 mt-1">
              Selamat Datang, <span className="font-semibold text-indigo-600">{user?.name}</span>! Kelola PPDB sekolah Anda dari sini.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex gap-3">
            <Link
              href="/admin/students?tab=pending"
              className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Verifikasi Siswa
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live
            </span>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{data?.stats?.total_registrations || 0}</h3>
          <p className="text-sm font-medium text-gray-500">Total Pendaftar</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform duration-300">
              <UserPlus className="w-6 h-6" />
            </div>
            {data?.stats?.pending_verification ? (
              <span className="flex items-center text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg animate-pulse">
                Perlu Aksi
              </span>
            ) : null}
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{data?.stats?.pending_verification || 0}</h3>
          <p className="text-sm font-medium text-gray-500">Menunggu Verifikasi</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{data?.stats?.verified || 0}</h3>
          <p className="text-sm font-medium text-gray-500">Siswa Terverifikasi</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Registrations Widget */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/40">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
              Pendaftaran Terbaru
            </h3>
            <Link href="/admin/students" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center hover:underline">
              Lihat Semua <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="p-0">
            {data?.recent_registrations && data.recent_registrations.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.recent_registrations.map((reg: any) => (
                  <div key={reg.id} className="p-4 flex items-center hover:bg-white/60 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-sm mr-4 border-2 border-white shadow-sm">
                      {reg.student?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{reg.student?.name || 'Nama Tidak Tersedia'}</p>
                      <p className="text-xs text-gray-500 truncate">{reg.student?.email || '-'}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wide rounded-full ${reg.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                        reg.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {reg.status === 'submitted' ? 'PENDING' : reg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                Belum ada pendaftaran siswa baru.
              </div>
            )}
          </div>
        </div>

        {/* Quick Info / Callout */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400 opacity-10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-2xl font-extrabold mb-2">Siap untuk PPDB?</h3>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              Pastikan data sekolah Anda sudah lengkap agar calon siswa dapat mendaftar dengan mudah. Bagikan link pendaftaran Anda sekarang.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
              <p className="text-xs text-indigo-200 uppercase tracking-widest font-semibold mb-1">Link Pendaftaran</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono text-white truncate flex-1 block">
                  {getRegistrationLink() || 'Link belum tersedia (Belum diverifikasi)'}
                </code>
                <button
                  onClick={() => {
                    const link = getRegistrationLink();
                    if (link) {
                      navigator.clipboard.writeText(link);
                      alert('Link berhasil disalin!');
                    }
                  }}
                  className="text-xs bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex-shrink-0"
                  disabled={!getRegistrationLink()}
                >
                  Copy
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                const link = getRegistrationLink();
                if (link) {
                  window.open(`https://wa.me/?text=Silakan daftar ke sekolah kami melalui link berikut: ${encodeURIComponent(link)}`, '_blank')
                }
              }}
              className="w-full py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!getRegistrationLink()}
            >
              Bagikan Link ke WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}