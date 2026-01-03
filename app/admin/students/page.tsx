'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Filter, CheckCircle2, XCircle, Clock, User, Mail, Calendar } from 'lucide-react'

interface Registration {
    id: number
    status: string
    program: string
    academic_year: string
    created_at: string
    form_data: string
    student: {
        id: number
        name: string
        email: string
    }
}

export default function StudentsManagementPage() {
    const { token } = useAuth()
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [actionLoading, setActionLoading] = useState<number | null>(null)

    const fetchRegistrations = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/registrations', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setRegistrations(data.data || [])
            }
        } catch (error) {
            console.error('Error fetching registrations:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchRegistrations()
    }, [token])

    const handleVerify = async (id: number) => {
        setActionLoading(id)
        try {
            const response = await fetch(`/api/registrations/${id}/verify`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                fetchRegistrations()
            }
        } catch (error) {
            console.error('Error verifying:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (id: number) => {
        setActionLoading(id)
        try {
            const response = await fetch(`/api/registrations/${id}/reject`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                fetchRegistrations()
            }
        } catch (error) {
            console.error('Error rejecting:', error)
        } finally {
            setActionLoading(null)
        }
    }

    const filtered = registrations.filter(r => {
        const matchesSearch = r.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || r.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-50 text-green-700 border border-green-100 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" />Terverifikasi</span>
            case 'rejected':
                return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-50 text-red-700 border border-red-100 flex items-center"><XCircle className="w-3 h-3 mr-1" />Ditolak</span>
            default:
                return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100 flex items-center"><Clock className="w-3 h-3 mr-1" />Pending</span>
        }
    }

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verifikasi Siswa</h1>
                <p className="text-sm text-gray-500 mt-1">Kelola pendaftaran siswa baru yang masuk.</p>
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
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Cari nama siswa..."
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
                            <option value="submitted">Pending</option>
                            <option value="verified">Terverifikasi</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Siswa</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Program</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                        Memuat data pendaftaran...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                        Tidak ada data pendaftaran.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-sm mr-3 border-2 border-white shadow-sm">
                                                    {reg.student?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{reg.student?.name || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500 flex items-center">
                                                        <Mail className="w-3 h-3 mr-1" />
                                                        {reg.student?.email || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                            {reg.program}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(reg.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(reg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {reg.status === 'submitted' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleVerify(reg.id)}
                                                        disabled={actionLoading === reg.id}
                                                        className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition flex items-center disabled:opacity-50"
                                                    >
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        {actionLoading === reg.id ? '...' : 'Verifikasi'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(reg.id)}
                                                        disabled={actionLoading === reg.id}
                                                        className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition flex items-center disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        {actionLoading === reg.id ? '...' : 'Tolak'}
                                                    </button>
                                                </div>
                                            )}
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
