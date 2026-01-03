'use client'

import { Smartphone, Bell, Lock, Zap, Cloud, Users, ArrowRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Responsif Total",
    desc: "Akses dari smartphone, tablet, atau laptop dengan tampilan optimal dan menarik.",
    stat: "100% Mobile-Friendly",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: "Notifikasi Real-time",
    desc: "Email & WhatsApp notification untuk setiap update status pendaftaran.",
    stat: "Instant Alert",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Keamanan Data",
    desc: "Enkripsi end-to-end, backup harian, dan akses role-based.",
    stat: "ISO 27001 Standard",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Proses Cepat",
    desc: "Formulir otomatis, validasi real-time, dan submit instan.",
    stat: "5x Lebih Cepat",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Cloud-Based",
    desc: "Tidak perlu install software. Buka browser dan mulai pakai.",
    stat: "Always Online",
    color: "from-indigo-500 to-blue-600"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Multi-user Support",
    desc: "Sekolah bisa punya banyak admin dengan permission berbeda.",
    stat: "Team Collaboration",
    color: "from-red-500 to-rose-500"
  }
]

export default function Features() {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Mengapa Memilih <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              Yuksekolah?
            </span>
          </h2>
          <p className="text-gray-700 text-xl leading-relaxed">
            Platform lengkap dengan segala fitur yang sekolah dan siswa butuhkan
            untuk proses pendaftaran yang <span className="font-semibold text-primary-600">smooth</span> dan <span className="font-semibold text-secondary-600">efisien</span>.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-900/5 border border-gray-100 overflow-hidden"
            >
              {/* Hover Gradient Overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${feature.color} transition-opacity duration-300`}></div>

              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">{feature.title}</h3>
              <p className="text-gray-700 mb-6 leading-relaxed delay-75">{feature.desc}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider group-hover:bg-primary-50 group-hover:text-primary-700 transition-colors">
                  {feature.stat}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-24 relative overflow-hidden rounded-[2.5rem] bg-gray-900 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-20"></div>
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-secondary-600/30 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>

          <div className="relative z-10 px-8 py-16 md:py-20 text-center max-w-4xl mx-auto">
            <div className="text-6xl mb-6 animate-bounce delay-1000">🚀</div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              Siap Transformasi Sekolah Anda?
            </h3>
            <p className="text-blue-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Bergabung dengan hundreds sekolah modern lainnya. Setup instan, tanpa biaya tersembunyi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:bg-gray-50 transition-all flex items-center justify-center group">
                Jadwalkan Demo Gratis
                <ArrowRight className="ml-2 w-5 h-5 text-primary-600 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://wa.me/6281779203711?text=Halo%20Tim%20Sales%20Yuksekolah%2C%20saya%20tertarik%20untuk%20mengetahui%20lebih%20lanjut%20tentang%20platform%20Anda."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Hubungi Tim Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}