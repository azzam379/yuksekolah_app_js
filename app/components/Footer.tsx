'use client'

import {
  Facebook, Twitter, Instagram, Youtube,
  Mail, Phone, MapPin, Heart
} from 'lucide-react'
import Link from 'next/link'
import Logo from './Logo'

const footerLinks = {
  Produk: [
    { label: 'Untuk Sekolah', href: '#sekolah' },
    { label: 'Untuk Siswa', href: '#siswa' },
    { label: 'Fitur', href: '#fitur' },
    { label: 'Biaya', href: '/harga' },
    { label: 'Demo', href: '/demo' }
  ],
  Perusahaan: [
    { label: 'Tentang Kami', href: '/tentang' },
    { label: 'Blog', href: '/blog' },
    { label: 'Karir', href: '/karir' },
    { label: 'Partner', href: '/partner' },
    { label: 'Press Kit', href: '/press' }
  ],
  Dukungan: [
    { label: 'Pusat Bantuan', href: '/bantuan' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Kontak', href: '/kontak' },
    { label: 'Status Sistem', href: '/status' },
    { label: 'API Docs', href: '/api-docs' }
  ],
  Legal: [
    { label: 'Kebijakan Privasi', href: '/privacy' },
    { label: 'Syarat Layanan', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'GDPR', href: '/gdpr' },
    { label: 'SLA', href: '/sla' }
  ]
}

const socialLinks = [
  { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
  { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
  { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
  { icon: <Youtube className="w-5 h-5" />, href: '#', label: 'YouTube' }
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <Logo className="text-white" />
            </div>

            <p className="text-gray-300 leading-relaxed">
              Membantu sekolah Indonesia bertransformasi digital dengan solusi
              pendaftaran siswa baru yang cepat, aman, dan efisien.
            </p>

            <div className="pt-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Ikuti Kami</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-lg mb-6 text-white">{category}</h4>
              <ul className="space-y-4">
                {links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-200 block text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 border-t border-gray-800 pt-12">
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-800 flex items-start space-x-4">
            <div className="p-3 bg-primary-900/30 rounded-lg text-primary-400">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-300 mb-1">Hubungi Kami</div>
              <div className="font-semibold text-lg hover:text-primary-400 transition-colors cursor-pointer text-white">021-1234-5678</div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-800 flex items-start space-x-4">
            <div className="p-3 bg-secondary-900/30 rounded-lg text-secondary-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-300 mb-1">Email Kami</div>
              <div className="font-semibold text-lg hover:text-secondary-400 transition-colors cursor-pointer text-white">hello@yuksekolah.id</div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-800 flex items-start space-x-4">
            <div className="p-3 bg-green-900/30 rounded-lg text-green-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-300 mb-1">Lokasi Kantor</div>
              <div className="font-semibold text-lg text-white">Jakarta, Indonesia</div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Yuksekolah. All rights reserved.
          </div>

          <div className="flex items-center text-gray-500 text-sm bg-gray-800/50 px-4 py-2 rounded-full">
            <span>Dibuat dengan</span>
            <Heart className="w-4 h-4 mx-1.5 text-red-500 fill-red-500 animate-pulse" />
            <span>untuk Pendidikan Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}