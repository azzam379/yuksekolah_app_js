'use client'

import { ClipboardCheck, Link as LinkIcon, BarChart3, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    icon: <ClipboardCheck className="w-8 h-8" />,
    step: "01",
    title: "Daftar & Verifikasi",
    desc: "Isi data sekolah, upload dokumen, tunggu verifikasi 1x24 jam.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <LinkIcon className="w-8 h-8" />,
    step: "02",
    title: "Dapatkan Link Unik",
    desc: "Bagikan link pendaftaran ke calon siswa via WhatsApp, email, atau website.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    step: "03",
    title: "Kelola & Pantau",
    desc: "Dashboard real-time, ekspor data Excel, notifikasi otomatis.",
    color: "from-green-500 to-emerald-500"
  }
]

export default function ForSchool() {
  return (
    <section id="sekolah" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Untuk Sekolah
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transformasi Digital untuk
            <span className="block text-primary-600">Penerimaan Siswa Baru</span>
          </h2>
          <p className="text-gray-700 text-lg">
            Hemat waktu, kurangi kesalahan administrasi, berikan pengalaman terbaik untuk calon siswa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-100"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${item.color} text-white mb-6`}>
                {item.icon}
              </div>
              <div className="text-sm font-semibold text-gray-400 mb-2">STEP {item.step}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-700 mb-6">{item.desc}</p>
              <div className="h-1 w-12 bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-primary-500 group-hover:to-secondary-500 transition-all"></div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/daftar-sekolah"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all group"
          >
            Daftarkan Sekolah Anda Sekarang
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="text-gray-500 mt-4 text-sm">
            Gratis 30 hari pertama • Tidak perlu kartu kredit
          </p>
        </div>
      </div>
    </section>
  )
}