'use client'

import Sidebar from '@/components/school-admin/Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SchoolAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [isMounting, setIsMounting] = useState(true)

    useEffect(() => {
        setIsMounting(false)
    }, [])

    useEffect(() => {
        if (!isLoading && !isMounting) {
            if (!user || user.role !== 'school_admin') {
                router.push('/login')
            }
        }
    }, [user, isLoading, isMounting, router])

    if (isLoading || isMounting) return null
    if (!user || user.role !== 'school_admin') return null

    return (
        <div className="min-h-screen bg-[url('/grid-pattern.svg')] bg-fixed bg-cover">
            {/* Ambient Background Overlay - matching /daftar-sekolah vibes */}
            <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/80 via-white/80 to-blue-50/80 -z-10"></div>

            <Sidebar />

            <div className="md:ml-64 transition-all duration-300">
                <main className="p-4 md:p-8 min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
