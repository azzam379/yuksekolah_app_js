'use client'

import { CheckCircle, MessageCircle, Phone, Mail } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    q: "Apakah benar-benar gratis?",
    a: "Ya! 30 hari pertama gratis tanpa biaya apapun. Setelah itu, pakai plan sesuai kebutuhan sekolah."
  },
  {
    q: "Berapa lama verifikasi sekolah?",
    a: "Maksimal 1x24 jam pada hari kerja. Tim kami akan mengecek data sekolah Anda."
  },
  {
    q: "Bisa untuk semua jenjang sekolah?",
    a: "Bisa! SD, SMP, SMA, SMK, bahkan Madrasah. Sistem fleksibel untuk berbagai kebutuhan."
  }
]

export default function CTA() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (

    <section className="py-20 bg-[url('/grid-pattern.svg')] bg-cover bg-center">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-indigo-100 overflow-hidden">
            {/* Decorative blobs matching Hero style */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10"></div>

            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left - CTA Content */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                  Siap Transformasi
                  <span className="block text-primary-600">Proses Pendaftaran?</span>
                </h2>

                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Bergabung dengan sekolah-sekolah visioner yang sudah memulai digitalisasi.
                  Hemat waktu, kurangi biaya administrasi, berikan pengalaman terbaik.
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    "Dashboard admin real-time",
                    "Formulir responsive mobile-first",
                    "Notifikasi email & WhatsApp",
                    "Ekspor data ke Excel",
                    "Multi-user admin sekolah",
                    "Support 24/7"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center group">
                      <div className="mr-3 p-1 rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <a
                    href="https://wa.me/6281779203711"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center shadow-sm hover:shadow-md"
                  >
                    <MessageCircle className="mr-2 w-5 h-5 text-green-600" />
                    Chat Admin via WhatsApp
                  </a>
                </div>
              </div>

              {/* Right - FAQ & Contact (Glass Card on Light) */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Pertanyaan Umum</h3>

                <div className="space-y-3 mb-8">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-md transition border border-gray-100"
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-gray-800 text-sm md:text-base">{faq.q}</h4>
                        <div className={`transform transition-transform text-gray-400 ${openIndex === i ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>
                      {openIndex === i && (
                        <p className="mt-3 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">{faq.a}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold mb-4 text-gray-900">Butuh bantuan cepat?</h4>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white rounded-xl border border-gray-100">
                      <Phone className="w-5 h-5 mr-3 text-primary-600" />
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Telepon</div>
                        <div className="font-semibold text-gray-900">021-1234-5678</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-xl border border-gray-100">
                      <Mail className="w-5 h-5 mr-3 text-primary-600" />
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Email</div>
                        <div className="font-semibold text-gray-900">hello@yuksekolah.id</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl text-center border border-primary-100">
                  <div className="text-xs font-bold text-primary-600 mb-1 uppercase tracking-wider">*Promo Terbatas</div>
                  <div className="text-lg font-bold text-gray-900">Gratis 30 Hari Pertama</div>
                  <div className="text-xs text-gray-600 mt-1">Untuk 50 sekolah pendaftar pertama</div>
                </div>
              </div>
            </div>

            {/* Trust badges bottom */}
            <div className="mt-12 pt-8 border-t border-indigo-100/50">
              <div className="text-center text-gray-500 mb-6 text-sm">
                Platform ini menggunakan teknologi terenkripsi sesuai standar keamanan tinggi
              </div>
              <div className="flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {['SSL Secure', 'GDPR Compliant', 'ISO 27001', 'Cloudflare'].map((badge, i) => (
                  <div key={i} className="flex items-center px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm text-xs font-medium text-gray-600">
                    <CheckCircle className="w-3 h-3 mr-1.5 text-green-500" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}