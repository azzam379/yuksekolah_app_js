'use client'

import { Smartphone, FileEdit, Eye, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Terima Link",
    desc: "Dapatkan link pendaftaran dari sekolah tujuan Anda via WhatsApp atau email.",
    time: "1 menit"
  },
  {
    icon: <FileEdit className="w-8 h-8" />,
    title: "Isi Formulir",
    desc: "Isi data diri & upload berkas langsung dari smartphone. Auto-save draft.",
    time: "5-10 menit"
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Pantau Status",
    desc: "Login ke akun pribadi untuk lihat status pendaftaran dan pengumuman.",
    time: "Real-time"
  }
]

export default function ForStudent() {
  return (
    <section id="siswa" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">
              Untuk Calon Siswa
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Daftar Sekolah Jadi
              <span className="block text-secondary-600">Lebih Cepat & Praktis</span>
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Tidak perlu datang ke sekolah, tidak perlu fotokopi berkas berlembar-lembar.
              Semua proses digital dari genggaman tangan Anda.
            </p>

            <div className="space-y-6">
              {steps.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-gray-700 mb-1">{item.desc}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Selesai dalam {item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl border border-primary-100">
              <div className="flex items-center">
                <div className="text-3xl mr-4">💡</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Tips Pendaftaran</h4>
                  <p className="text-gray-600 text-sm">
                    Siapkan scan/foto: Pas foto 3x4, ijazah, dan kartu keluarga sebelum mulai mengisi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Stats Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Manfaat Digitalisasi</h3>

            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Penghematan Waktu</span>
                  <span className="font-bold">70%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full w-3/4"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Pengurangan Kesalahan Data</span>
                  <span className="font-bold">90%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full w-9/10"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Kepuasan Calon Siswa</span>
                  <span className="font-bold">95%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-800 rounded-xl">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-gray-300">Akses Formulir</div>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-xl">
                <div className="text-3xl font-bold">0</div>
                <div className="text-sm text-gray-300">Antrian</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}