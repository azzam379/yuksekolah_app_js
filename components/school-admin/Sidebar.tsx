'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, LogOut, School } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Sidebar() {
    const pathname = usePathname()
    const { logout, user } = useAuth()

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Siswa & PPDB', href: '/admin/students', icon: Users },
        { name: 'Pengumuman', href: '/admin/announcements', icon: FileText },
        { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
    ]

    const isActive = (href: string) => pathname.startsWith(href)

    return (
        <div className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 min-h-screen fixed left-0 top-0 bottom-0 z-50">
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                        <School className="w-4 h-4" />
                    </div>
                    <span className="text-lg font-bold text-gray-800 tracking-tight">Admin Sekolah</span>
                </div>
            </div>

            {/* School Info Card */}
            <div className="px-3 pt-4 pb-2">
                <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 mb-2">
                    <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wider mb-1">Sekolah Anda</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.school?.name || 'Sekolah'}</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto px-3">
                <nav className="space-y-1">
                    <div className="px-3 mb-2 mt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu Utama</div>
                    {navigation.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${active
                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
                            >
                                <item.icon
                                    className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* User & Logout */}
            <div className="flex-shrink-0 border-t border-gray-100 p-3 bg-gray-50/30">
                <div className="mb-3 px-3">
                    <p className="text-xs font-medium text-gray-500">Login sebagai</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors group"
                >
                    <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                    Logout
                </button>
            </div>
        </div>
    )
}
