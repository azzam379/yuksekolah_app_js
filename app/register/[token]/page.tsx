'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, ArrowRight, User, BookOpen, MapPin, Users, CheckCircle, GraduationCap, AlertCircle, Clock, ShieldCheck, Check } from 'lucide-react'

interface SchoolInfo {
  id: number
  name: string
  email: string
  programs: string[]
}

interface FormData {
  full_name: string
  email: string
  phone: string
  birth_place: string
  birth_date: string
  gender: 'male' | 'female'
  program: string
  previous_school: string
  previous_school_year: string
  address: string
  city: string
  province: string
  postal_code: string
  father_name: string
  father_phone: string
  father_job: string
  mother_name: string
  mother_phone: string
  mother_job: string
  terms_accepted: boolean
}

// Loading component
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/grid-pattern.svg')] bg-cover bg-center">
      <div className="text-center bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Memuat formulir pendaftaran...</p>
      </div>
    </div>
  )
}

function StudentRegistrationContent() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const token = params.token as string

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<any>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [loginRequired, setLoginRequired] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    birth_place: '',
    birth_date: '',
    gender: 'male',
    program: '',
    previous_school: '',
    previous_school_year: '2024',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    father_name: '',
    father_phone: '',
    father_job: '',
    mother_name: '',
    mother_phone: '',
    mother_job: '',
    terms_accepted: false
  })

  // Fetch school information based on token
  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/school-by-link/${token}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Link pendaftaran tidak valid atau sudah kadaluarsa')
          }
          throw new Error('Gagal memuat informasi sekolah')
        }

        const data = await response.json()
        setSchoolInfo({
          id: data.school.id,
          name: data.school.name,
          email: data.school.email,
          programs: data.programs || ['IPA', 'IPS', 'Bahasa', 'Agama']
        })

        // Set default program if available
        if (data.programs && data.programs.length > 0) {
          setFormData(prev => ({ ...prev, program: data.programs[0] }))
        }

      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchSchoolInfo()
    }
  }, [token])

  // Prefill form if user is logged in
  useEffect(() => {
    if (user && user.role === 'student') {
      setFormData(prev => ({
        ...prev,
        full_name: user.name,
        email: user.email
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const validateStep = (step: number): string => {
    switch (step) {
      case 1:
        if (!formData.full_name.trim()) return 'Nama lengkap harus diisi'
        if (!formData.email.trim()) return 'Email harus diisi'
        if (!formData.email.includes('@')) return 'Format email tidak valid'
        if (!formData.phone.trim()) return 'Nomor telepon harus diisi'
        if (!formData.birth_place.trim()) return 'Tempat lahir harus diisi'
        if (!formData.birth_date) return 'Tanggal lahir harus diisi'
        return ''
      case 2:
        if (!formData.program) return 'Pilih program/jurusan'
        if (!formData.previous_school.trim()) return 'Sekolah asal harus diisi'
        if (!formData.previous_school_year) return 'Tahun lulus harus diisi'
        return ''
      case 3:
        if (!formData.address.trim()) return 'Alamat harus diisi'
        if (!formData.city.trim()) return 'Kota harus diisi'
        if (!formData.province.trim()) return 'Provinsi harus diisi'
        return ''
      case 4:
        if (!formData.father_name.trim()) return 'Nama ayah harus diisi'
        if (!formData.father_phone.trim()) return 'Nomor telepon ayah harus diisi'
        if (!formData.mother_name.trim()) return 'Nama ibu harus diisi'
        if (!formData.mother_phone.trim()) return 'Nomor telepon ibu harus diisi'
        return ''
      case 5:
        if (!formData.terms_accepted) return 'Anda harus menyetujui syarat dan ketentuan'
        return ''
      default:
        return ''
    }
  }

  const nextStep = () => {
    const error = validateStep(currentStep)
    if (error) {
      setError(error)
      return
    }
    setError('')
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }

  const prevStep = () => {
    setError('')
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    const error = validateStep(5)
    if (error) {
      setError(error)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/submit-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          school_link: token,
          form_data: {
            name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            program: formData.program,
            birth_place: formData.birth_place,
            birth_date: formData.birth_date,
            gender: formData.gender,
            previous_school: formData.previous_school,
            previous_school_year: formData.previous_school_year,
            address: `${formData.address}, ${formData.city}, ${formData.province} ${formData.postal_code}`,
            father_name: formData.father_name,
            father_phone: formData.father_phone,
            father_job: formData.father_job,
            mother_name: formData.mother_name,
            mother_phone: formData.mother_phone,
            mother_job: formData.mother_job
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setLoginRequired(true)
        }
        throw new Error(data.message || 'Pendaftaran gagal. Silakan coba lagi.')
      }

      setSuccess(true)
      setRegistrationResult(data)

      // Auto login logic (optional, preserved from original)
      try {
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.student_account.email,
            password: data.student_account.password
          })
        })

        if (loginResponse.ok) {
          const loginData = await loginResponse.json()
          const token = loginData.data?.token || loginData.token
          if (token) setAuthToken(token)
        }
      } catch (e) {
        console.error('Auto login failed:', e)
      }

      setCurrentStep(6)

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <LoadingState />

  if (error && !schoolInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/grid-pattern.svg')] bg-cover bg-center px-4 relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/90 via-white/90 to-blue-50/90 -z-10"></div>

        <div className="max-w-md w-full text-center bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/50 animate-shake">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Link Tidak Valid</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  const steps = [
    { num: 1, icon: User, label: 'Data Diri' },
    { num: 2, icon: BookOpen, label: 'Pendidikan' },
    { num: 3, icon: MapPin, label: 'Alamat' },
    { num: 4, icon: Users, label: 'Wali' },
    { num: 5, icon: ShieldCheck, label: 'Konfirmasi' }
  ]

  return (
    <div className="min-h-screen bg-[url('/grid-pattern.svg')] bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/90 via-white/90 to-blue-50/90 -z-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors group bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Formulir Pendaftaran Siswa</h1>
          <p className="text-lg text-gray-600 font-medium">{schoolInfo?.name}</p>
          <p className="text-sm text-gray-500 mt-1">Tahun Ajaran 2026/2027</p>
        </div>

        {/* Progress Steps (Hidden on success) */}
        {!success && (
          <div className="mb-10 mx-auto max-w-3xl">
            <div className="relative flex items-center justify-between">
              {/* Connector Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-indigo-600 -z-10 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              ></div>

              {steps.map((s) => {
                const isActive = currentStep >= s.num;
                const isCurrent = currentStep === s.num;
                return (
                  <div key={s.num} className="relative flex flex-col items-center group">
                    <div className={`
                      w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-4 transition-all duration-300 shadow-lg z-10
                      ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-400'}
                      ${isCurrent ? 'scale-110 ring-4 ring-indigo-100' : ''}
                    `}>
                      {isActive && !isCurrent ? <Check className="w-5 h-5" /> : <s.icon className="w-4 h-4 md:w-5 md:h-5" />}
                    </div>
                    <span className={`mt-2 text-xs md:text-sm font-bold bg-white/60 backdrop-blur px-2 py-1 rounded-lg transition-colors ${isActive ? 'text-indigo-700' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden relative animate-fade-in-up animation-delay-300">
          {/* Decorative top border */}
          <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">{error}</p>
                {loginRequired && (
                  <div className="mt-2 text-sm">
                    <Link href="/login" className="font-bold text-red-700 underline hover:text-red-800">Login sekarang</Link> untuk melanjutkan.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-6 md:p-10">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Data Pribadi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} readOnly={!!user && user.role === 'student'}
                      className={`w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900 ${user?.role === 'student' ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`} placeholder="Sesuai akta kelahiran" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} readOnly={!!user && user.role === 'student'}
                      className={`w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900 ${user?.role === 'student' ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`} placeholder="email@contoh.com" required />
                    {user && user.role === 'student' && <p className="text-xs text-indigo-600 mt-1 font-medium">✨ Terisi otomatis dari akun Anda</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">No. Telepon/WA <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900" placeholder="0812..." required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tempat Lahir <span className="text-red-500">*</span></label>
                    <input type="text" name="birth_place" value={formData.birth_place} onChange={handleChange} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Lahir <span className="text-red-500">*</span></label>
                    <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin <span className="text-red-500">*</span></label>
                  <div className="flex gap-4">
                    {['male', 'female'].map((g) => (
                      <label key={g} className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-center font-bold ${formData.gender === g ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="sr-only" />
                        {g === 'male' ? 'Laki-laki' : 'Perempuan'}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {currentStep === 2 && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Data Pendidikan</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Jurusan/Program <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {schoolInfo?.programs.map((prog) => (
                      <label key={prog} className={`p-4 border-2 rounded-xl cursor-pointer transition-all text-center font-bold ${formData.program === prog ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="program" value={prog} checked={formData.program === prog} onChange={handleChange} className="sr-only" />
                        {prog}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Sekolah Asal <span className="text-red-500">*</span></label>
                    <input type="text" name="previous_school" value={formData.previous_school} onChange={handleChange} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900" placeholder="Nama sekolah sebelumnya" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tahun Lulus <span className="text-red-500">*</span></label>
                    <select name="previous_school_year" value={formData.previous_school_year} onChange={handleChange} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900">
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Alamat Lengkap</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Jalan <span className="text-red-500">*</span></label>
                  <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900 resize-none" placeholder="Nama Jalan, RT/RW, Kelurahan" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Kota/Kab <span className="text-red-500">*</span></label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Provinsi <span className="text-red-500">*</span></label>
                    <input type="text" name="province" value={formData.province} onChange={handleChange} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Kode Pos</label>
                    <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Guardians */}
            {currentStep === 4 && (
              <div className="animate-fade-in space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Data Orang Tua / Wali</h2>

                <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                  <h3 className="text-indigo-800 font-bold mb-4 flex items-center"><User className="w-5 h-5 mr-2" /> Data Ayah</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="father_name" value={formData.father_name} onChange={handleChange} className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900" placeholder="Nama Lengkap Ayah *" required />
                    <input type="tel" name="father_phone" value={formData.father_phone} onChange={handleChange} className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900" placeholder="No. HP Ayah *" required />
                    <input type="text" name="father_job" value={formData.father_job} onChange={handleChange} className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900 md:col-span-2" placeholder="Pekerjaan Ayah" />
                  </div>
                </div>

                <div className="bg-pink-50/50 p-6 rounded-xl border border-pink-100">
                  <h3 className="text-pink-800 font-bold mb-4 flex items-center"><User className="w-5 h-5 mr-2" /> Data Ibu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" name="mother_name" value={formData.mother_name} onChange={handleChange} className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all font-medium text-gray-900" placeholder="Nama Lengkap Ibu *" required />
                    <input type="tel" name="mother_phone" value={formData.mother_phone} onChange={handleChange} className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all font-medium text-gray-900" placeholder="No. HP Ibu *" required />
                    <input type="text" name="mother_job" value={formData.mother_job} onChange={handleChange} className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all font-medium text-gray-900 md:col-span-2" placeholder="Pekerjaan Ibu" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Konfirmasi Data</h2>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-sm space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Nama Lengkap</span>
                    <span className="font-bold text-gray-900">{formData.full_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Program</span>
                    <span className="font-bold text-gray-900">{formData.program}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Email</span>
                    <span className="font-bold text-gray-900">{formData.email}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-500">Sekolah Asal</span>
                    <span className="font-bold text-gray-900">{formData.previous_school}</span>
                  </div>
                </div>

                <div className="flex items-start bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <input type="checkbox" id="terms" checked={formData.terms_accepted} onChange={(e) => setFormData({ ...formData, terms_accepted: e.target.checked })} className="mt-1 w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer" />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-700 cursor-pointer">
                    Saya menyatakan bahwa data yang saya isi adalah benar dan dapat dipertanggungjawabkan. Saya setuju dengan <span className="font-bold text-indigo-600">Syarat & Ketentuan</span> yang berlaku di {schoolInfo?.name}.
                  </label>
                </div>
              </div>
            )}

            {/* Step 6: Success */}
            {currentStep === 6 && (
              <div className="animate-fade-in text-center py-8">
                <div className="inline-flex relative mb-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">✨</div>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Pendaftaran Berhasil! 🎉</h2>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                  Terima kasih, <span className="font-bold text-gray-900">{formData.full_name}</span>.
                  Data pendaftaran Anda telah kami terima dan sedang dalam proses verifikasi.
                </p>
                <div className="bg-indigo-50 rounded-2xl p-6 max-w-lg mx-auto mb-8 border border-indigo-100 text-left">
                  <h3 className="font-bold text-indigo-900 mb-3 flex items-center"><GraduationCap className="w-5 h-5 mr-2" /> Detail Akun Siswa</h3>
                  {registrationResult?.student_account && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between bg-white p-3 rounded-lg border border-indigo-100">
                        <span className="text-gray-500">Email Login</span>
                        <span className="font-mono font-bold text-gray-900">{registrationResult.student_account.email}</span>
                      </div>
                      <div className="flex justify-between bg-white p-3 rounded-lg border border-indigo-100">
                        <span className="text-gray-500">Password Sementara</span>
                        <span className="font-mono font-bold text-gray-900">{registrationResult.student_account.password}</span>
                      </div>
                      <p className="text-xs text-indigo-600 mt-2">
                        ⚠️ Simpan password ini! Gunakan untuk login dan memantau status pendaftaran Anda.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-4">
                  <Link href="/login" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all hover:-translate-y-1">
                    Login Siswa
                  </Link>
                  <Link href="/" className="px-8 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
                    Ke Beranda
                  </Link>
                </div>
              </div>
            )}

            {/* Buttons Navigation */}
            {currentStep < 6 && (
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse md:flex-row gap-4 justify-between items-center">
                {currentStep > 1 ? (
                  <button onClick={prevStep} className="px-6 py-3 text-gray-500 font-bold hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Sebelumnya
                  </button>
                ) : (
                  <div></div> // Spacer
                )}

                <button
                  onClick={currentStep === 5 ? handleSubmit : nextStep}
                  disabled={isSubmitting || (currentStep === 5 && !formData.terms_accepted)}
                  className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>Memproses...</>
                  ) : (
                    <>{currentStep === 5 ? 'Kirim Pendaftaran' : 'Lanjut'} <ArrowRight className="ml-2 w-5 h-5" /></>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default function StudentRegistrationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StudentRegistrationContent />
    </Suspense>
  )
}