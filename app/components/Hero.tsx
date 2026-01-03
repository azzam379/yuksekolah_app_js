'use client'

import { ArrowRight, Shield, Users, CheckCircle, Rocket, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[url('/grid-pattern.svg')] bg-cover bg-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 opacity-90"></div>

      {/* Animated Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-secondary-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-2xl relative z-10 animate-fade-in-up">
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <Shield className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-semibold text-gray-700">Aman & Terenkripsi</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <Users className="w-4 h-4 text-primary-600 mr-2" />
                <span className="text-sm font-semibold text-gray-700">100+ Sekolah Bergabung</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Daftar Sekolah <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 animate-gradient-x">
                Tanpa Ribet
              </span>
            </h1>

            <p className="text-lg text-gray-700 mb-10 md:text-xl leading-relaxed max-w-lg">
              Solusi pendaftaran PPDB digital #1 di Indonesia. Kelola data siswa, pembayaran, dan seleksi dalam satu dashboard pintar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/daftar-sekolah"
                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center">
                  Mulai Gratis 30 Hari
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform text-white" />
                </div>
              </Link>

              <a
                href="https://wa.me/6281779203711?text=Halo%20Tim%20Sales%20Yuksekolah%2C%20saya%20tertarik%20untuk%20mengetahui%20lebih%20lanjut%20tentang%20platform%20Anda."
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-100 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <MessageCircle className="mr-2 w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                Hubungi Tim Sales
              </a>


            </div>

            {/* Partner logos */}
            <div className="border-t border-gray-200/60 pt-8">
              <p className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wider">Dipercaya oleh institusi terbaik:</p>
              <div className="flex flex-wrap gap-x-8 gap-y-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                {['Al-Azhar', 'Penabur', 'Negeri 1', 'Global School'].map((name, i) => (
                  <span key={i} className="text-lg font-bold text-gray-500 hover:text-primary-600 transition-colors cursor-default">{name}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative lg:scale-110 animate-fade-in-left animation-delay-500 hidden lg:block">
            <div className="relative z-10 bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-4 shadow-2xl border border-white/50 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-[2rem] p-1 shadow-inner">
                <div className="bg-white rounded-[1.8rem] overflow-hidden relative h-[500px] flex flex-col">
                  {/* Mockup Header */}
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                  {/* Mockup Content */}
                  <div className="p-6 flex-1 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <div className="h-2 w-16 bg-gray-300 rounded mb-2"></div>
                        <div className="h-6 w-32 bg-gray-900 rounded-lg"></div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary-100"></div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold">✓</div>
                        <div className="flex-1">
                          <div className="h-4 w-24 bg-gray-800 rounded mb-1"></div>
                          <div className="h-3 w-16 bg-gray-400 rounded"></div>
                        </div>
                        <div className="text-green-600 font-bold text-sm">Valid</div>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 opacity-75">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">⏳</div>
                        <div className="flex-1">
                          <div className="h-4 w-32 bg-gray-800 rounded mb-1"></div>
                          <div className="h-3 w-20 bg-gray-400 rounded"></div>
                        </div>
                        <div className="text-yellow-600 font-bold text-sm">Proses</div>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 opacity-50">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold">#</div>
                        <div className="flex-1">
                          <div className="h-4 w-20 bg-gray-800 rounded mb-1"></div>
                          <div className="h-3 w-12 bg-gray-400 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-primary-700">TOTAL PENDAFTAR</span>
                        <span className="text-xs font-bold text-primary-700">+12%</span>
                      </div>
                      <div className="h-2 w-full bg-primary-200 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-primary-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-1/4 -left-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-float z-20">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold">STATUS</div>
                  <div className="text-sm font-bold text-gray-900">Terverifikasi</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-1/4 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-float animation-delay-2000 z-20">
              <div className="flex items-center gap-3">
                <div className="bg-secondary-100 p-2 rounded-lg">
                  <Rocket className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold">PENDAFTARAN</div>
                  <div className="text-sm font-bold text-gray-900">5 Menit Selesai</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}