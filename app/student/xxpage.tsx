'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Registration {
  id: number
  school_id: number
  program: string
  academic_year: string
  status: 'draft' | 'submitted' | 'verified' | 'rejected'
  created_at: string
  form_data: {
    name: string
    email: string
    phone: string
    birth_place: string
    birth_date: string
    address: string
    previous_school: string
    [key: string]: any
  }
  school?: {
    id: number
    name: string
    email: string
    phone: string
  }
  files?: Array<{
    id: number
    file_type: string
    original_name: string
    file_url: string
  }>
}

export default function StudentDashboard() {
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Redirect jika bukan student
  useEffect(() => {
    if (user && user.role !== 'student') {
      router.push('/')
    }
  }, [user, router])

  // Fetch student data
  useEffect(() => {
    if (!token) return

    const controller = new AbortController()
    
    const fetchStudentData = async () => {
      try {
        setIsLoading(true)
        
        const response = await fetch('http://localhost:8000/api/dashboard/student', {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal
        })
        
        if (!response.ok) throw new Error('Gagal memuat data siswa')
        
        const data = await response.json()
        setRegistration(data.registration)

      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Gagal memuat dashboard')
          console.error('Dashboard error:', err)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentData()
    
    return () => controller.abort()
  }, [token])

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'verified': 
        return { 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '✅',
          label: 'Diterima',
          description: 'Selamat! Pendaftaran Anda telah diverifikasi dan diterima.'
        }
      case 'submitted': 
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⏳',
          label: 'Menunggu Verifikasi',
          description: 'Pendaftaran Anda sedang diproses oleh admin sekolah.'
        }
      case 'rejected': 
        return { 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '❌',
          label: 'Ditolak',
          description: 'Pendaftaran Anda tidak dapat diproses. Silakan hubungi sekolah.'
        }
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '📝',
          label: 'Draft',
          description: 'Pendaftaran belum lengkap.'
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data siswa...</p>
        </div>
      </div>
    )
  }

  const statusConfig = registration ? getStatusConfig(registration.status) : getStatusConfig('draft')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                YS
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Siswa</h1>
                <p className="text-sm text-gray-600">Pantau status pendaftaran Anda</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Welcome Card */}
        <div className="mb-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold">Halo, {user?.name}! 👋</h2>
              <p className="mt-2 opacity-90">
                {registration 
                  ? `Anda mendaftar di ${registration.school?.name || 'sekolah'} melalui platform Yuksekolah.`
                  : 'Selamat datang di dashboard siswa Yuksekolah.'
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{statusConfig.icon}</div>
              <div>
                <div className="text-sm opacity-80">Status Pendaftaran</div>
                <div className="text-xl font-bold">{statusConfig.label}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className={`lg:col-span-2 border rounded-xl p-6 ${statusConfig.color}`}>
            <h3 className="text-lg font-semibold mb-3">Status Pendaftaran</h3>
            <p className="mb-4">{statusConfig.description}</p>
            
            {registration && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-gray-700">Tanggal Pendaftaran</span>
                  <span className="font-medium">{formatDate(registration.created_at)}</span>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="text-gray-700">Sekolah Tujuan</span>
                  <span className="font-medium">{registration.school?.name || 'Tidak tersedia'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Program/Jurusan</span>
                  <span className="font-medium">{registration.program}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-5">
              <h4 className="font-semibold text-gray-900 mb-3">📋 Dokumen</h4>
              <p className="text-sm text-gray-600 mb-4">
                {registration?.files && registration.files.length > 0 
                  ? `${registration.files.length} file terupload`
                  : 'Belum ada file terupload'
                }
              </p>
              <button className="w-full px-4 py-2.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition text-sm">
                {registration?.files ? 'Lihat Dokumen' : 'Upload Dokumen'}
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow p-5">
              <h4 className="font-semibold text-gray-900 mb-3">📞 Kontak Sekolah</h4>
              {registration?.school ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{registration.school.email}</p>
                  <p className="text-sm text-gray-600">{registration.school.phone}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Informasi belum tersedia</p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        {registration?.form_data && (
          <div className="bg-white rounded-xl shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Data Pribadi</h3>
              <p className="text-sm text-gray-600 mt-1">Informasi yang Anda submit saat pendaftaran</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">{registration.form_data.name}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">{registration.form_data.email}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">{registration.form_data.phone}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tempat, Tanggal Lahir</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">
                    {registration.form_data.birth_place}, {registration.form_data.birth_date}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg">{registration.form_data.address}</div>
                </div>
                
                {registration.form_data.previous_school && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sekolah Asal</label>
                    <div className="bg-gray-50 px-4 py-3 rounded-lg">{registration.form_data.previous_school}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Langkah Selanjutnya</h3>
          
          <div className="space-y-4">
            {registration?.status === 'submitted' && (
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 text-xl mr-3">⏳</div>
                <div>
                  <h4 className="font-medium text-blue-900">Menunggu Verifikasi Admin</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Admin sekolah akan memverifikasi data Anda dalam 1-3 hari kerja.
                    Anda akan mendapat notifikasi via email.
                  </p>
                </div>
              </div>
            )}
            
            {registration?.status === 'verified' && (
              <div className="flex items-start p-4 bg-green-50 rounded-lg">
                <div className="text-green-600 text-xl mr-3">✅</div>
                <div>
                  <h4 className="font-medium text-green-900">Pendaftaran Diterima!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Selamat! Pendaftaran Anda telah diverifikasi. Silakan hubungi sekolah untuk informasi 
                    lebih lanjut tentang tes selanjutnya atau daftar ulang.
                  </p>
                </div>
              </div>
            )}
            
            {registration?.status === 'rejected' && (
              <div className="flex items-start p-4 bg-red-50 rounded-lg">
                <div className="text-red-600 text-xl mr-3">❌</div>
                <div>
                  <h4 className="font-medium text-red-900">Pendaftaran Ditolak</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Mohon maaf, pendaftaran Anda tidak dapat diproses. 
                    Silakan hubungi sekolah untuk informasi lebih detail.
                  </p>
                </div>
              </div>
            )}
            
            {!registration && (
              <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
                <div className="text-yellow-600 text-xl mr-3">📝</div>
                <div>
                  <h4 className="font-medium text-yellow-900">Belum Ada Pendaftaran</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Anda belum mengisi formulir pendaftaran. 
                    Dapatkan link pendaftaran dari sekolah tujuan Anda.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            {registration && (
              <button className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                Cetak Formulir
              </button>
            )}
            <Link 
              href="/"
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}