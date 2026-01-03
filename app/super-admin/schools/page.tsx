'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Filter, MoreHorizontal, School, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react'

interface School {
    id: number
    name: string
    email: string
    status: 'pending' | 'active' | 'inactive'
    created_at: string
}

export default function SchoolManagementPage() {
    const { token } = useAuth()
    const [schools, setSchools] = useState<School[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        const fetchSchools = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/schools', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (response.ok) {
                    const data = await response.json()
                    setSchools(data.data || [])
                } else {
                    throw new Error('Gagal mengambil data sekolah')
                }
            } catch (e) {
                console.error(e)
                setSchools([])
            } finally {
                setIsLoading(false)
            }
        }

        if (token) fetchSchools()
    }, [token])

    const filtered = schools.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Sekolah</h1>
                <p className="text-sm text-gray-500 mt-1">Daftar semua sekolah yang terdaftar dalam sistem.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
                            placeholder="Cari nama sekolah..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            className="block w-full sm:w-auto p-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Semua Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Sekolah</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Terdaftar Sejak</th>
                                <th className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                        Memuat data sekolah...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                        Tidak ada data sekolah.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((school) => (
                                    <tr key={school.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                    <School className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{school.name}</div>
                                                    <div className="text-xs text-gray-500">{school.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex items-center text-xs font-medium rounded-full 
                                        ${school.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                    school.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                                        'bg-red-50 text-red-700 border border-red-100'}`}>

                                                {school.status === 'active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> :
                                                    school.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> :
                                                        <XCircle className="w-3 h-3 mr-1" />}
                                                {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(school.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}