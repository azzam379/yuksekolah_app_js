'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Filter, Plus, MoreHorizontal, Shield, Mail, UserCheck, Trash2 } from 'lucide-react'

interface User {
    id: number
    name: string
    email: string
    role: string
    created_at: string
}

export default function UserManagementPage() {
    const { token } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) throw new Error('Gagal mengambil data user')

                const data = await response.json()
                setUsers(data.data || []) // Assume response structure has data property
            } catch (error) {
                console.error('Error fetching users:', error)
                // Fallback static data if fetch fails just for demo stability if backend is empty
                // But ideally we want to show empty state if truly empty
                setUsers([])
            } finally {
                setIsLoading(false)
            }
        }

        if (token) fetchUsers()
    }, [token])

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    return (
        <div className="min-h-screen">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen User</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola akses dan role pengguna sistem.</p>
                </div>
                <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah User Baru
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                            placeholder="Cari nama atau email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            className="block w-full sm:w-auto p-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">Semua Role</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="school_admin">School Admin</option>
                            <option value="student">Student</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Info</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal Gabung</th>
                                <th className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                        Memuat data user...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                        Tidak ada user ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs ring-2 ring-white">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center">
                                                        <Mail className="w-3 h-3 mr-1" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
                                        ${user.role === 'super_admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                                    user.role === 'school_admin' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                        'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                                                {user.role === 'super_admin' ? 'Super Admin' :
                                                    user.role === 'school_admin' ? 'School Admin' : user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit User">
                                                    <UserCheck className="w-4 h-4" />
                                                </button>
                                                <button className="text-gray-400 hover:text-red-600 transition-colors" title="Delete User">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Static for now) */}
                {!isLoading && filteredUsers.length > 0 && (
                    <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <div className="text-xs text-gray-500">
                            Menampilkan <span className="font-medium">{filteredUsers.length}</span> user
                        </div>
                        <div className="flex gap-1">
                            <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                            <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}