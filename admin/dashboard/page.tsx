'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Student {
  id: number
  name: string
  email: string
}

interface Registration {
  id: number
  student: Student
  program: string
  status: 'draft' | 'submitted' | 'verified' | 'rejected'
  created_at: string
}

interface DashboardStats {
  total_registrations: number
  pending_verification: number
  verified: number
  today_registrations: number
}

interface WeeklyData {
  date: string
  count: number
}

export default function SchoolAdminDashboard() {
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [recentRegistrations, setRecentRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified'>('all')

  // Get school registration link from user data
  const schoolLink = user?.school?.registration_link || ''
  // Extract token if link is a full URL (legacy data support)
  const schoolToken = schoolLink ? schoolLink.split('/').pop() : ''

  // Di dalam component, tambahkan:
  useEffect(() => {
    console.log('🔍 DEBUG User Data:', user);
    console.log('🔍 DEBUG School Data:', user?.school);
    console.log('🔍 DEBUG Registration Link:', user?.school?.registration_link);
  }, [user]);

  // Redirect jika bukan school admin
  useEffect(() => {
    if (user && user.role !== 'school_admin') {
      router.push('/')
    }
  }, [user, router])

  // Fetch dashboard data dengan AbortController untuk cleanup
  useEffect(() => {
    if (!token || !user?.school_id) return

    const controller = new AbortController()

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        const [statsResponse] = await Promise.all([
          fetch('http://localhost:8000/api/dashboard/school-stats', {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal
          })
        ])

        if (!statsResponse.ok) throw new Error('Gagal memuat data dashboard')

        const dashboardData = await statsResponse.json()

        setStats(dashboardData.stats)
        setWeeklyData(dashboardData.weekly_data || [])
        setRecentRegistrations(dashboardData.recent_registrations || [])

      } catch (err: any) {
        // Ignore abort errors
        if (err.name !== 'AbortError') {
          setError(err.message || 'Gagal memuat data dashboard')
          console.error('Dashboard error:', err)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()

    // Cleanup function
    return () => controller.abort()
  }, [token, user?.school_id])

  const handleVerifyRegistration = async (registrationId: number, status: 'verified' | 'rejected') => {
    if (!token) return

    try {
      const response = await fetch(`http://localhost:8000/api/registrations/${registrationId}/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          notes: `${status === 'verified' ? 'Diterima' : 'Ditolak'} oleh admin`
        })
      })

      if (response.ok) {
        // Refresh recent registrations only
        const statsResponse = await fetch('http://localhost:8000/api/dashboard/school-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const dashboardData = await statsResponse.json()
        setRecentRegistrations(dashboardData.recent_registrations || [])
      }
    } catch (error) {
      console.error('Verification error:', error)
    }
  }

  const handleCopyLink = () => {
    if (schoolToken) {
      const fullLink = `${window.location.origin}/register/${schoolToken}`
      navigator.clipboard.writeText(fullLink)
      alert('Link berhasil disalin!')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const filteredRegistrations = recentRegistrations.filter(reg => {
    if (activeTab === 'pending') return reg.status === 'submitted'
    if (activeTab === 'verified') return reg.status === 'verified'
    return true
  })

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified': return { color: 'bg-green-100 text-green-800', label: 'Diterima' }
      case 'submitted': return { color: 'bg-yellow-100 text-yellow-800', label: 'Menunggu' }
      case 'rejected': return { color: 'bg-red-100 text-red-800', label: 'Ditolak' }
      default: return { color: 'bg-gray-100 text-gray-800', label: 'Draft' }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Memuat dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                YS
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Admin Sekolah</h1>
                <p className="text-sm text-gray-600">{user?.school?.name || `ID: ${user?.school_id}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* School Link Card */}
        {schoolLink ? (
          <div className="mb-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow p-6 text-black">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold mb-2">Link Pendaftaran Siswa Baru</h2>
                <p className="text-black/80 text-sm mb-4">
                  Bagikan link ini kepada calon siswa untuk mendaftar.
                </p>
                <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2 pr-4 backdrop-blur-sm">
                  <span className="bg-white text-primary-600 px-2 py-1 rounded text-xs font-bold">LINK</span>
                  <code className="text-sm font-mono truncate max-w-md">
                    {typeof window !== 'undefined' ? `${window.location.origin}/register/${schoolToken}` : `.../register/${schoolToken}`}
                  </code>
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition shadow-lg flex items-center gap-2"
              >
                <span>📋</span> Salin Link
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl shadow p-6">
            <div className="flex items-start">
              <div className="text-yellow-600 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="font-semibold text-yellow-800">Link Pendaftaran Belum Tersedia</h3>
                <p className="text-sm text-yellow-700 mt-1 mb-3">
                  Status sekolah: <span className="font-medium">{user?.school?.status || 'unknown'}</span>
                </p>
                <p className="text-sm text-yellow-700">
                  {user?.school?.status === 'active'
                    ? 'Hubungi super admin untuk mengaktifkan link pendaftaran.'
                    : 'Sekolah belum aktif. Tunggu verifikasi super admin.'}
                </p>

                {/* DEBUG INFO */}
                <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono">
                  <div>School ID: {user?.school_id}</div>
                  <div>School Status: {user?.school?.status}</div>
                  <div>Has Link: {user?.school?.registration_link ? 'YES' : 'NO'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'total_registrations', label: 'Total Pendaftar', color: 'text-gray-900' },
            { key: 'pending_verification', label: 'Menunggu Verifikasi', color: 'text-yellow-600' },
            { key: 'verified', label: 'Telah Diverifikasi', color: 'text-green-600' },
            { key: 'today_registrations', label: 'Hari Ini', color: 'text-blue-600' }
          ].map((stat) => (
            <div key={stat.key} className="bg-white rounded-xl shadow p-5">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stats ? stats[stat.key as keyof DashboardStats] : 0}
              </div>
              <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Weekly Chart */}
        {weeklyData.length > 0 && (
          <div className="bg-white rounded-xl shadow p-5 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik 7 Hari Terakhir</h3>
            <div className="flex items-end h-32 gap-1.5">
              {weeklyData.map((day, index) => {
                const maxCount = Math.max(...weeklyData.map(d => d.count), 1)
                const heightPercent = Math.max(10, (day.count / maxCount) * 90)
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-primary-400 to-primary-300 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${heightPercent}%` }}
                      title={`${day.count} pendaftar`}
                    />
                    <div className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                      {new Date(day.date).toLocaleDateString('id-ID', { weekday: 'narrow' })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent Registrations */}
        <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Data Pendaftar</h2>
                <p className="text-sm text-gray-600 mt-1">Verifikasi atau tolak pendaftaran siswa</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'verified'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === tab
                      ? tab === 'all' ? 'bg-primary-100 text-primary-700'
                        : tab === 'pending' ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {tab === 'all' ? 'Semua' : tab === 'pending' ? `Menunggu (${stats?.pending_verification || 0})` : `Diverifikasi (${stats?.verified || 0})`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-500">
              Tidak ada data pendaftar
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRegistrations.map((registration) => {
                    const statusConfig = getStatusConfig(registration.status)
                    return (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-900">{registration.student.name}</div>
                          <div className="text-sm text-gray-500">{registration.student.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {registration.program}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-600 text-sm">
                          {formatDate(registration.created_at)}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            {registration.status === 'submitted' && (
                              <>
                                <button
                                  onClick={() => handleVerifyRegistration(registration.id, 'verified')}
                                  className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition text-sm"
                                >
                                  ✓ Terima
                                </button>
                                <button
                                  onClick={() => handleVerifyRegistration(registration.id, 'rejected')}
                                  className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition text-sm"
                                >
                                  ✗ Tolak
                                </button>
                              </>
                            )}
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm">
                              Detail
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3">📊 Ekspor Data</h3>
            <p className="text-sm text-gray-600 mb-4">Download data pendaftar dalam format Excel</p>
            <button className="w-full px-4 py-2.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition text-sm font-medium">
              Ekspor ke Excel
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3">📢 Kirim Pengumuman</h3>
            <p className="text-sm text-gray-600 mb-4">Kirim notifikasi ke semua pendaftar</p>
            <button className="w-full px-4 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium">
              Buat Pengumuman
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-gray-900 mb-3">⚙️ Pengaturan</h3>
            <p className="text-sm text-gray-600 mb-4">Kelola informasi sekolah</p>
            <Link
              href={`/admin/settings`}
              className="block w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium text-center"
            >
              Buka Pengaturan
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}