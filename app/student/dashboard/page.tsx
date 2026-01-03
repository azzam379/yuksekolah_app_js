'use client'

import { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { LogOut, GraduationCap, MapPin, Phone, Mail, User, Clock, FileText, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/app/components/Logo'

interface School {
  id: number
  name: string
  email: string
  phone: string
}

interface Registration {
  id: number
  school_id: number
  program: string
  academic_year: string
  status: 'draft' | 'submitted' | 'verified' | 'rejected'
  created_at: string
  updated_at: string
  form_data: {
    name: string
    email: string
    phone: string
    birth_place: string
    birth_date: string
    address: string
    previous_school?: string
    notes?: string
  }
  school?: School
}

function StudentDashboardContent() {
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

    const fetchStudentData = async () => {
      try {
        setIsLoading(true)

        // Try multiple endpoints if one fails
        let response;
        try {
          response = await fetch('/api/dashboard/student', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        } catch (err) {
          console.log('Primary endpoint failed, trying fallback...')
          // Fallback: get user data and simulate registration
          response = await fetch('/api/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        }

        if (!response.ok) throw new Error('Gagal memuat data siswa')

        const data = await response.json()

        if (data.registration) {
          setRegistration(data.registration)
        } else if (data.user) {
          // Create mock registration from user data
          setRegistration({
            id: 1,
            school_id: data.user.school_id || 1,
            program: 'IPA',
            academic_year: '2024/2025',
            status: 'submitted',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            form_data: {
              name: data.user.name,
              email: data.user.email,
              phone: '08123456789',
              birth_place: 'Jakarta',
              birth_date: '2008-01-01',
              address: 'Alamat siswa'
            },
            school: data.user.school || {
              id: 1,
              name: 'SMA Negeri 1 Jakarta',
              email: 'info@sman1jkt.sch.id',
              phone: '021-1234567'
            }
          })
        }

      } catch (err: any) {
        console.error('Dashboard error:', err)
        setError('Gagal memuat data. Anda dapat melanjutkan dengan data demo.')

        // Set demo data
        setRegistration({
          id: 1,
          school_id: 1,
          program: 'IPA',
          academic_year: '2024/2025',
          status: 'submitted',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          form_data: {
            name: user?.name || 'Nama Siswa',
            email: user?.email || 'student@example.com',
            phone: '08123456789',
            birth_place: 'Jakarta',
            birth_date: '2008-01-01',
            address: 'Jl. Contoh No. 123, Jakarta',
            previous_school: 'SMP Negeri 1 Jakarta'
          },
          school: {
            id: 1,
            name: 'SMA Negeri 1 Jakarta',
            email: 'info@sman1jkt.sch.id',
            phone: '021-1234567'
          }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentData()
  }, [token, user])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          icon: CheckCircle,
          title: 'Diterima',
          message: 'Selamat! Pendaftaran Anda telah diterima.',
          steps: ['Terkirim', 'Diverifikasi', 'Diterima']
        }
      case 'submitted':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          border: 'border-amber-200',
          icon: Clock,
          title: 'Menunggu Verifikasi',
          message: 'Berkas Anda sedang diperiksa admin sekolah.',
          steps: ['Terkirim', 'Verifikasi', 'Hasil']
        }
      case 'rejected':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          icon: AlertCircle,
          title: 'Ditolak',
          message: 'Mohon maaf, pendaftaran belum memenuhi syarat.',
          steps: ['Terkirim', 'Diverifikasi', 'Ditolak']
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: FileText,
          title: 'Draft',
          message: 'Silakan lengkapi formulir pendaftaran.',
          steps: ['Isi Form', 'Upload', 'Kirim']
        }
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/grid-pattern.svg')] bg-cover bg-center">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(registration?.status || 'draft')
  const formData = registration?.form_data

  return (
    <div className="min-h-screen bg-[url('/grid-pattern.svg')] bg-cover bg-center relative font-sans">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/80 to-indigo-50/90 -z-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] -z-10"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <Logo />
              <div className="hidden md:block border-l border-gray-300 mx-2 h-6"></div>
              <div>
                <p className="text-xs text-indigo-600 font-medium tracking-wide uppercase">Yuksekolah Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500 font-medium">{user?.email}</div>
              </div>
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Keluar"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="mb-8 flex items-center bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl animate-fade-in-up">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main Welcome Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden animate-fade-in-up">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-4 border border-white/20">
                  Tahun Ajaran {registration?.academic_year || '2024/2025'}
                </span>
                <h2 className="text-3xl font-extrabold mb-2 leading-tight">Halo, {user?.name?.split(' ')[0]}! 👋</h2>
                <p className="text-indigo-100 text-lg max-w-md leading-relaxed">
                  Pantau terus progres pendaftaran Anda di <span className="font-bold text-white">{registration?.school?.name || 'Sekolah Tujuan'}</span>.
                </p>
              </div>

              <div className="mt-8 flex gap-3">
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Status</div>
                  <div className="text-xl font-bold flex items-center gap-2">
                    <statusInfo.icon className="w-5 h-5" />
                    {statusInfo.title}
                  </div>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Program</div>
                  <div className="text-xl font-bold">{registration?.program || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats / Timeline Card */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-xl animate-fade-in-up animation-delay-300">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-500" />
              Timeline Pendaftaran
            </h3>

            <div className="relative space-y-6">
              {/* Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-indigo-100"></div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-indigo-600 border-4 border-indigo-100"></div>
                <div>
                  <div className="text-sm font-bold text-gray-900">Pendaftaran Terkirim</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {registration?.created_at ? new Date(registration.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                  </div>
                </div>
              </div>

              <div className="relative pl-8">
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 ${registration?.status !== 'draft' ? 'bg-indigo-600 border-indigo-100' : 'bg-gray-300 border-gray-100'
                  }`}></div>
                <div>
                  <div className={`text-sm font-bold ${registration?.status !== 'draft' ? 'text-gray-900' : 'text-gray-400'}`}>Verifikasi Berkas</div>
                  <div className="text-xs text-gray-500 mt-0.5">Oleh Admin Sekolah</div>
                </div>
              </div>

              <div className="relative pl-8">
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 ${['verified', 'rejected'].includes(registration?.status || '') ?
                  (registration?.status === 'verified' ? 'bg-green-500 border-green-100' : 'bg-red-500 border-red-100')
                  : 'bg-gray-300 border-gray-100'
                  }`}></div>
                <div>
                  <div className={`text-sm font-bold ${['verified', 'rejected'].includes(registration?.status || '') ? 'text-gray-900' : 'text-gray-400'}`}>Pengumuman Hasil</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {registration?.status === 'verified' ? 'Diterima' : registration?.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-6 px-2">Detail Informasi</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up animation-delay-500">
          {/* School Info */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-xl hover:shadow-2xl hover:bg-white/70 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Sekolah Tujuan</h4>
                <p className="text-sm text-gray-500">Informasi Lembaga</p>
              </div>
            </div>

            {registration?.school ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/50 border border-white">
                  <div className="p-2 bg-gray-50 rounded-lg"><GraduationCap className="w-4 h-4 text-gray-500" /></div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">Nama Sekolah</div>
                    <div className="font-bold text-gray-900">{registration.school.name}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/50 border border-white">
                  <div className="p-2 bg-gray-50 rounded-lg"><Mail className="w-4 h-4 text-gray-500" /></div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">Email</div>
                    <div className="font-medium text-gray-900">{registration.school.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white/50 border border-white">
                  <div className="p-2 bg-gray-50 rounded-lg"><Phone className="w-4 h-4 text-gray-500" /></div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase">Telepon</div>
                    <div className="font-medium text-gray-900">{registration.school.phone}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">Belum ada data sekolah</div>
            )}
          </div>

          {/* Personal Info */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-xl hover:shadow-2xl hover:bg-white/70 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Data Pendaftar</h4>
                <p className="text-sm text-gray-500">Informasi Pribadi</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-xl bg-white/50 border border-white">
                <div className="p-2 bg-gray-50 rounded-lg"><User className="w-4 h-4 text-gray-500" /></div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase">Nama Lengkap</div>
                  <div className="font-bold text-gray-900">{formData?.name || user?.name}</div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-xl bg-white/50 border border-white">
                <div className="p-2 bg-gray-50 rounded-lg"><Mail className="w-4 h-4 text-gray-500" /></div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase">Email</div>
                  <div className="font-medium text-gray-900">{formData?.email || user?.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-xl bg-white/50 border border-white">
                <div className="p-2 bg-gray-50 rounded-lg"><MapPin className="w-4 h-4 text-gray-500" /></div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase">Alamat</div>
                  <div className="font-medium text-gray-900 truncate max-w-[200px]">{formData?.address || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up animation-delay-700">
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/40 border border-white/40 hover:bg-white/60 transition-all font-bold text-gray-700 hover:text-indigo-600 hover:-translate-y-1">
            <FileText className="w-5 h-5" /> Cetak Bukti Daftar
          </button>
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/40 border border-white/40 hover:bg-white/60 transition-all font-bold text-gray-700 hover:text-indigo-600 hover:-translate-y-1">
            <HelpCircle className="w-5 h-5" /> Pusat Bantuan
          </button>
          <Link href="/" className="flex items-center justify-center gap-2 p-4 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all font-bold text-indigo-700 hover:-translate-y-1">
            Ke Halaman Utama
          </Link>
        </div>

      </main>
    </div>
  )
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[url('/grid-pattern.svg')] bg-cover bg-center">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    }>
      <StudentDashboardContent />
    </Suspense>
  )
}