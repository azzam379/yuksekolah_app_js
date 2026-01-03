'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Admin SMA Negeri 1 Jakarta",
    content: "Sejak pakai Yuksekolah, proses pendaftaran siswa baru jadi 70% lebih cepat. Orang tua siswa juga sangat terbantu karena tidak perlu datang ke sekolah berulang kali.",
    avatar: "BS",
    rating: 5
  },
  {
    name: "Siti Rahayu",
    role: "Kepala Sekolah SMP Islam Terpadu",
    content: "Dashboard yang sangat user-friendly. Tim kami bisa memantau progress pendaftaran real-time dan melakukan verifikasi dengan cepat.",
    avatar: "SR",
    rating: 5
  },
  {
    name: "Ahmad Fauzi",
    role: "Orang Tua Siswa",
    content: "Pendaftaran untuk anak saya sangat lancar. Hanya perlu 10 menit dari rumah, tidak perlu antri berjam-jam di sekolah. Sistem yang sangat membantu!",
    avatar: "AF",
    rating: 4
  },
  {
    name: "Dewi Lestari",
    role: "Admin Yayasan Pendidikan Bangsa",
    content: "Multi-school management-nya sangat membantu untuk yayasan kami yang punya 5 sekolah. Semua data terkonsolidasi dengan rapi.",
    avatar: "DL",
    rating: 5
  }
]

export default function Testimonial() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  const next = () => {
    setCurrent(prev => (prev + 1) % testimonials.length)
    setAutoplay(false)
  }

  const prev = () => {
    setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length)
    setAutoplay(false)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full text-sm font-semibold mb-4">
            <Quote className="w-4 h-4 mr-2" />
            Testimoni Pengguna
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dipercaya oleh
            <span className="block text-primary-600">Sekolah & Orang Tua Siswa</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            {/* Quote icon */}
            <div className="absolute top-8 right-8 text-primary-100 text-6xl">
              "
            </div>

            {/* Carousel content */}
            <div className="mb-8">
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl mr-6">
                  {testimonials[current].avatar}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{testimonials[current].name}</h4>
                  <p className="text-gray-700 mb-2">{testimonials[current].role}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonials[current].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-800 text-lg italic">
                "{testimonials[current].content}"
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrent(i)
                      setAutoplay(false)
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-gradient-to-r from-primary-600 to-secondary-600' : 'bg-gray-300'}`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={prev}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { value: "150+", label: "Sekolah Bergabung" },
              { value: "50K+", label: "Pendaftar Diproses" },
              { value: "98%", label: "Kepuasan Pengguna" },
              { value: "24/7", label: "Support Tersedia" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm border">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}