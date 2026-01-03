'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, School, Users, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Sidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    const navigation = [
        { name: 'Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard },
        { name: 'Sekolah', href: '/super-admin/schools', icon: School },
        { name: 'Users', href: '/super-admin/users', icon: Users },
        { name: 'Settings', href: '/super-admin/settings', icon: Settings },
    ]

    const isActive = (href: string) => pathname.startsWith(href)

    return (
        <div className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-gray-100 min-h-screen fixed left-0 top-0 bottom-0 z-50">
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                        YA
                    </div>
                    <span className="text-lg font-bold text-gray-800 tracking-tight">YukAdmin</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto px-3 py-4">
                <nav className="space-y-1">
                    <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</div>
                    {navigation.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${active
                                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
                            >
                                <item.icon
                                    className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* User & Logout */}
            <div className="flex-shrink-0 border-t border-gray-100 p-3">
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