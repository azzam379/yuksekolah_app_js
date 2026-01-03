'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, CheckCircle, School, User, ShieldCheck, Clock, Check, AlertCircle } from 'lucide-react'

interface FormData {
  school_name: string
  school_email: string
  school_phone: string
  school_address: string
  admin_name: string
  admin_email: string
  admin_password: string
  confirm_password: string
  terms_accepted: boolean
}

export default function SchoolRegistrationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    school_name: '',
    school_email: '',
    school_phone: '',
    school_address: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
    confirm_password: '',
    terms_accepted: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const validateStep1 = () => {
    if (!formData.school_name.trim()) return 'Nama sekolah harus diisi'
    if (!formData.school_email.trim()) return 'Email sekolah harus diisi'
    if (!formData.school_email.includes('@')) return 'Format email tidak valid'
    if (!formData.school_phone.trim()) return 'Nomor telepon harus diisi'
    if (!formData.school_address.trim()) return 'Alamat sekolah harus diisi'
    return ''
  }

  const validateStep2 = () => {
    if (!formData.admin_name.trim()) return 'Nama admin harus diisi'
    if (!formData.admin_email.trim()) return 'Email admin harus diisi'
    if (!formData.admin_email.includes('@')) return 'Format email admin tidak valid'
    if (formData.admin_password.length < 8) return 'Password minimal 8 karakter'
    if (formData.admin_password !== formData.confirm_password) return 'Password tidak cocok'
    if (!formData.terms_accepted) return 'Anda harus menyetujui syarat dan ketentuan'
    return ''
  }

  const handleNext = () => {
    if (currentStep === 1) {
      const error = validateStep1()
      if (error) {
        setError(error)
        return
      }
      setError('')
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validateStep2()
    if (error) {
      setError(error)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/register-school', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          school_name: formData.school_name,
          school_email: formData.school_email,
          school_phone: formData.school_phone,
          school_address: formData.school_address,
          admin_name: formData.admin_name,
          admin_email: formData.admin_email,
          admin_password: formData.admin_password,
          admin_password_confirmation: formData.confirm_password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Pendaftaran gagal. Silakan coba lagi.')
      }

      setSuccess(true)
      setRegistrationResult(data.data)
      setCurrentStep(3)

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
      console.error('Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[url('/grid-pattern.svg')] bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 opacity-90 -z-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-200/30 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors group bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Daftarkan Sekolah Anda
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Bergabung dengan ekosistem pendidikan digital modern.
            <span className="hidden sm:inline"> Kelola pendaftaran siswa dengan lebih efisien dan profesional.</span>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative flex items-center justify-between z-0">
            {/* Connector Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500 -z-10 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>

            {/* Step 1 */}
            <div className={`relative flex flex-col items-center group ${currentStep >= 1 ? 'text-primary-700' : 'text-gray-400'}`}>
              <div className={`
                 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-300 shadow-lg
                 ${currentStep >= 1 ? 'bg-white border-primary-500 text-primary-600 scale-110' : 'bg-gray-100 border-gray-200 text-gray-400'}
                 ${currentStep > 1 ? '!bg-primary-500 !border-primary-500 !text-white' : ''}
               `}>
                {currentStep > 1 ? <Check className="w-6 h-6" /> : <School className="w-5 h-5" />}
              </div>
              <span className="mt-3 text-sm font-bold bg-white/50 backdrop-blur px-2 py-1 rounded-lg">Data Sekolah</span>
            </div>

            {/* Step 2 */}
            <div className={`relative flex flex-col items-center group ${currentStep >= 2 ? 'text-primary-700' : 'text-gray-400'}`}>
              <div className={`
                 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-300 shadow-lg
                 ${currentStep >= 2 ? 'bg-white border-primary-500 text-primary-600 scale-110' : 'bg-gray-100 border-gray-200 text-gray-400'}
                 ${currentStep > 2 ? '!bg-primary-500 !border-primary-500 !text-white' : ''}
               `}>
                {currentStep > 2 ? <Check className="w-6 h-6" /> : <User className="w-5 h-5" />}
              </div>
              <span className="mt-3 text-sm font-bold bg-white/50 backdrop-blur px-2 py-1 rounded-lg">Admin</span>
            </div>

            {/* Step 3 */}
            <div className={`relative flex flex-col items-center group ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`
                 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-300 shadow-lg
                 ${currentStep >= 3 ? 'bg-green-500 border-green-500 text-white scale-110' : 'bg-gray-100 border-gray-200 text-gray-400'}
               `}>
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="mt-3 text-sm font-bold bg-white/50 backdrop-blur px-2 py-1 rounded-lg">Selesai</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden relative animate-fade-in-up animation-delay-300">
          {/* Decorative top border */}
          <div className="h-2 w-full bg-gradient-to-r from-primary-500 via-blue-500 to-secondary-500"></div>

          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Step 1: School Information */}
            {currentStep === 1 && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Informasi Sekolah</h2>
                  <p className="text-gray-500">Lengkapi data identitas sekolah Anda.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Sekolah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="school_name"
                      value={formData.school_name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      placeholder="Contoh: SMA Negeri 1 Jakarta"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Sekolah <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="school_email"
                        value={formData.school_email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                        placeholder="info@sekolah.sch.id"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nomor Telepon <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="school_phone"
                        value={formData.school_phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                        placeholder="021-1234567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="school_address"
                      value={formData.school_address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-gray-900 placeholder:text-gray-400 resize-none"
                      placeholder="Jalan, Kota, Provinsi, Kode Pos..."
                      required
                    />
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={handleNext}
                      className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
                    >
                      Lanjut ke Data Admin
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Admin Information */}
            {currentStep === 2 && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Admin Penanggung Jawab</h2>
                  <p className="text-gray-500">Akun ini akan menjadi Super Admin untuk dashboard sekolah.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="admin_name"
                        value={formData.admin_name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-gray-900"
                        placeholder="Nama Admin"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Login <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="admin_email"
                        value={formData.admin_email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-gray-900"
                        placeholder="admin@sekolah.sch.id"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="admin_password"
                        value={formData.admin_password}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-gray-900"
                        placeholder="Min. 8 karakter"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Konfirmasi Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-gray-900"
                        placeholder="Ulangi password"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="terms_accepted"
                          name="terms_accepted"
                          checked={formData.terms_accepted}
                          onChange={handleChange}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all cursor-pointer"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms_accepted" className="font-medium text-gray-700 cursor-pointer">
                          Saya menyetujui <span className="text-blue-600 hover:text-blue-700">Syarat & Ketentuan</span> serta <span className="text-blue-600 hover:text-blue-700">Kebijakan Privasi</span>.
                        </label>
                        <p className="text-gray-500 mt-1">Data yang saya berikan adalah benar dan dapat dipertanggungjawabkan.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 pt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Kembali
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !formData.terms_accepted}
                      className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none bg-[length:200%_auto] hover:bg-right"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Memproses Pendaftaran...
                        </>
                      ) : (
                        <>
                          Daftarkan Sekolah Sekarang
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {currentStep === 3 && registrationResult && (
              <div className="animate-fade-in text-center py-8">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-ping"></div>
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  Pendaftaran Berhasil! 🎉
                </h2>

                <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                  Selamat! Data sekolah <span className="font-bold text-gray-900">{formData.school_name}</span> telah kami terima.
                  Tim kami akan melakukan verifikasi secepatnya.
                </p>

                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-10 max-w-2xl mx-auto border border-gray-100 shadow-inner">
                  <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                    <h3 className="font-bold text-gray-900 flex items-center">
                      <ShieldCheck className="w-5 h-5 mr-2 text-primary-600" />
                      Detail Akun
                    </h3>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Menunggu Verifikasi
                    </span>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-50 shadow-sm">
                      <span className="text-gray-500 font-medium text-sm">Nama Sekolah</span>
                      <span className="font-bold text-gray-900">{registrationResult.school?.name}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-50 shadow-sm">
                      <span className="text-gray-500 font-medium text-sm">Email Admin</span>
                      <span className="font-bold text-gray-900">{registrationResult.admin?.email}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start text-left">
                    <div className="text-blue-600 mt-0.5 mr-3">ℹ️</div>
                    <p className="text-sm text-blue-800 leading-snug">
                      Cek email inbox/spam Anda secara berkala. Kami akan mengirimkan notifikasi setelah akun diverifikasi (estimasi 1x24 jam).
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/login"
                    className="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center transform hover:-translate-y-1"
                  >
                    Masuk ke Dashboard
                  </Link>
                  <Link
                    href="/"
                    className="px-10 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center"
                  >
                    Kembali ke Beranda
                  </Link>
                </div>

                <p className="mt-12 text-sm text-gray-400">
                  Butuh bantuan mendesak? <a href="#" className="text-blue-600 hover:underline">Hubungi Support</a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Floating Benefits */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-500">
          <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/40 hover:bg-white/60 transition-colors cursor-default group">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-blue-600 text-xl">⚡</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Proses Kilat</h4>
            <p className="text-sm text-gray-600">
              Verifikasi &lt; 24 jam. Langsung bisa terima siswa.
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/40 hover:bg-white/60 transition-colors cursor-default group">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-green-600 text-xl">🆓</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Gratis 30 Hari</h4>
            <p className="text-sm text-gray-600">
              Full akses ke semua fitur premium tanpa komitmen.
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/40 hover:bg-white/60 transition-colors cursor-default group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-purple-600 text-xl">🤝</span>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Bantuan 24/7</h4>
            <p className="text-sm text-gray-600">
              Tim support berdedikasi siap membantu Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}