'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  Hourglass,
  CheckCircle2,
  Users,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react'

interface School {
  id: number
  name: string
  email: string
  status: 'pending' | 'active' | 'inactive'
  created_at: string
}

interface DashboardStats {
  total_schools: number
  pending_schools: number
  active_schools: number
  total_registrations: number
}

export default function SuperAdminDashboard() {
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pendingSchools, setPendingSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [modalType, setModalType] = useState<'approve' | 'reject' | 'success_approve' | null>(null)
  const [generatedLink, setGeneratedLink] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch dashboard data
  useEffect(() => {
    if (!token) return

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Fetch stats
        const statsResponse = await fetch('/api/dashboard/super-admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!statsResponse.ok) throw new Error('Failed to fetch stats')
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
        setPendingSchools(statsData.pending_schools || [])

      } catch (err: any) {
        setError(err.message || 'Gagal memuat data dashboard')
        console.error('Dashboard error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [token])

  const openActionModal = (school: School, type: 'approve' | 'reject') => {
    setSelectedSchool(school)
    setModalType(type)
  }

  const closeModal = () => {
    setModalType(null)
    setSelectedSchool(null)
    setGeneratedLink('')
    // If we closed a success modal, reload data
    if (modalType === 'success_approve') {
      window.location.reload()
    }
  }

  const executeAction = async () => {
    if (!token || !selectedSchool || !modalType) return

    try {
      setActionLoading(true)
      const endpoint = modalType === 'approve' ? 'verify' : 'reject'
      const body = modalType === 'approve'
        ? { notes: 'Verified by super admin' }
        : { reason: 'Rejected by super admin' }

      const response = await fetch(`/api/schools/${selectedSchool.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        const result = await response.json()

        if (modalType === 'approve') {
          setGeneratedLink(result.registration_link)
          setModalType('success_approve')
        } else {
          alert('Sekolah berhasil ditolak.')
          window.location.reload()
        }
      } else {
        throw new Error('Gagal memproses aksi')
      }
    } catch (error) {
      console.error('Action error:', error)
      alert('Terjadi kesalahan sistem.')
    } finally {
      setActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex items-center space-x-2 text-gray-500 text-sm font-medium">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
          <span>Memuat dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Simplified Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">Pantau aktivitas sistem secara real-time.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-500">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        {/* Compact Stats Cards (Horizontal Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center shadow-sm hover:border-blue-300 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Sekolah</p>
              <h3 className="text-xl font-bold text-gray-900">{stats?.total_schools || 0}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center shadow-sm hover:border-yellow-300 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Hourglass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
              <h3 className="text-xl font-bold text-gray-900">{stats?.pending_schools || 0}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center shadow-sm hover:border-green-300 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Aktif</p>
              <h3 className="text-xl font-bold text-gray-900">{stats?.active_schools || 0}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center shadow-sm hover:border-purple-300 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Siswa</p>
              <h3 className="text-xl font-bold text-gray-900">{stats?.total_registrations || 0}</h3>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content: Pending Schools Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Menunggu Verifikasi</h2>
                </div>
                <button className="text-xs text-blue-600 font-medium hover:text-blue-700 hover:underline">
                  Lihat Semua
                </button>
              </div>

              {pendingSchools.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500">Semua sekolah telah diverifikasi.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sekolah</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {pendingSchools.map((school) => (
                        <tr key={school.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-5 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 mr-3 text-xs font-bold">
                                {school.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{school.name}</div>
                                <div className="text-xs text-gray-500">{school.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap text-xs text-gray-500">
                            {new Date(school.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openActionModal(school, 'approve')}
                                className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition tooltip"
                                title="Approve"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openActionModal(school, 'reject')}
                                className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                                title="Reject"
                              >
                                <span className="text-xs font-bold px-1">✕</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Quick Actions Widget */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/super-admin/schools" className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group">
                  <div className="p-2 bg-white rounded-md shadow-sm mr-3 group-hover:text-blue-600">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Cari Sekolah</span>
                  <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <button className="w-full flex items-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group">
                  <div className="p-2 bg-white rounded-md shadow-sm mr-3 group-hover:text-blue-600">
                    <Filter className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">System Logs</span>
                </button>
              </div>
            </div>

            {/* Mini System Status */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-5 text-white">
              <h3 className="text-sm font-bold mb-1 opacity-90">System Status</h3>
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs font-medium opacity-80">All services operational</span>
              </div>
              <div className="text-xs opacity-70 border-t border-white/20 pt-3">
                Last backup: 2 hours ago
              </div>
            </div>
          </div>
        </div>

        {/* Modal Overlay */}
        {modalType && selectedSchool && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up border border-gray-100">

              {/* Approve Confirmation */}
              {modalType === 'approve' && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-100">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Verifikasi Sekolah?</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Anda akan mengaktifkan akun <span className="font-semibold text-gray-900">{selectedSchool.name}</span>.
                      Email notifikasi akan dikirim ke admin sekolah.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={closeModal}
                      disabled={actionLoading}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={executeAction}
                      disabled={actionLoading}
                      className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium text-sm shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center"
                    >
                      {actionLoading ? 'Memproses...' : 'Ya, Aktifkan'}
                    </button>
                  </div>
                </>
              )}

              {/* Reject Confirmation */}
              {modalType === 'reject' && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                      <span className="text-2xl">✕</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Tolak Pendaftaran?</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Akun <span className="font-semibold text-gray-900">{selectedSchool.name}</span> akan dihapus permanen dari antrian.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={closeModal}
                      disabled={actionLoading}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={executeAction}
                      disabled={actionLoading}
                      className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium text-sm shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center"
                    >
                      {actionLoading ? 'Memproses...' : 'Ya, Tolak'}
                    </button>
                  </div>
                </>
              )}

              {/* Success Result */}
              {modalType === 'success_approve' && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-100">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Berhasil Diaktifkan!</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-4">
                      Link pendaftaran siswa (PPDB) untuk sekolah ini:
                    </p>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-xs text-center mb-4 text-blue-600 break-all select-all">
                      {typeof window !== 'undefined' ? `${window.location.origin}/register/${generatedLink.split('/').pop()}` : generatedLink}
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-medium text-sm transition-colors"
                  >
                    Tutup
                  </button>
                </>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  )
}