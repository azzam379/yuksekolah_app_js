'use client'

import Sidebar from '@/components/admin/Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SuperAdminLayout({
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
            if (!user || user.role !== 'super_admin') {
                router.push('/login')
            }
        }
    }, [user, isLoading, isMounting, router])

    if (isLoading || isMounting) return null

    if (!user || user.role !== 'super_admin') return null

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="md:ml-64 transition-all duration-300">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}