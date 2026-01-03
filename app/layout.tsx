import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yuksekolah - Platform Pendaftaran Siswa',
  description: 'Platform pendaftaran siswa baru digital untuk sekolah Indonesia',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={jakarta.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}