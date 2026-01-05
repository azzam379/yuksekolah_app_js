'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Filter, CheckCircle2, XCircle, Clock, Mail, Calendar, Key, UserCheck, Trash2, X, AlertTriangle, Eye, EyeOff } from 'lucide-react'

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

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<{ id: number; name: string; email: string } | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '' })

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
            if (response.ok) fetchRegistrations()
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
            if (response.ok) fetchRegistrations()
        } catch (error) {
            console.error('Error rejecting:', error)
        } finally {
            setActionLoading(null)
        }
    }

    // Edit Student
    const handleEditStudent = async () => {
        if (!selectedStudent) return
        try {
            setActionLoading(selectedStudent.id)
            const response = await fetch(`/api/users/${selectedStudent.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message)

            setShowEditModal(false)
            fetchRegistrations()
            alert('Data siswa berhasil diupdate')
        } catch (error: any) {
            alert(error.message || 'Gagal update data siswa')
        } finally {
            setActionLoading(null)
        }
    }

    // Delete Student
    const handleDeleteStudent = async () => {
        if (!selectedStudent) return
        try {
            setActionLoading(selectedStudent.id)
            const response = await fetch(`/api/users/${selectedStudent.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message)

            setShowDeleteModal(false)
            fetchRegistrations()
            alert('Siswa berhasil dihapus')
        } catch (error: any) {
            alert(error.message || 'Gagal menghapus siswa')
        } finally {
            setActionLoading(null)
        }
    }

    // Reset Password
    const handleResetPassword = async (student: { id: number; name: string; email: string }) => {
        try {
            setActionLoading(student.id)
            const response = await fetch(`/api/users/${student.id}/reset-password`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message)

            setSelectedStudent(student)
            setNewPassword(data.new_password)
            setShowPasswordModal(true)
        } catch (error: any) {
            alert(error.message || 'Gagal reset password')
        } finally {
            setActionLoading(null)
        }
    }

    const openEditModal = (student: { id: number; name: string; email: string }) => {
        setSelectedStudent(student)
        setFormData({ name: student.name, email: student.email })
        setShowEditModal(true)
    }

    const openDeleteModal = (student: { id: number; name: string; email: string }) => {
        setSelectedStudent(student)
        setShowDeleteModal(true)
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
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kelola Siswa</h1>
                <p className="text-sm text-gray-500 mt-1">Verifikasi, edit, dan kelola data siswa.</p>
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
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Cari nama siswa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            className="block w-full sm:w-auto p-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 bg-white"
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
                                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">Memuat data pendaftaran...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">Tidak ada data pendaftaran.</td></tr>
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
                                                        <Mail className="w-3 h-3 mr-1" />{reg.student?.email || '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{reg.program}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(reg.status)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {new Date(reg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1">
                                                {reg.status === 'submitted' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleVerify(reg.id)}
                                                            disabled={actionLoading === reg.id}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                            title="Verifikasi"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(reg.id)}
                                                            disabled={actionLoading === reg.id}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Tolak"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleResetPassword(reg.student)}
                                                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                                    title="Reset Password"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(reg.student)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit Siswa"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(reg.student)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Hapus Siswa"
                                                >
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
            </div>

            {/* Edit Student Modal */}
            {showEditModal && selectedStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Edit Data Siswa</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
                            <button onClick={handleEditStudent} disabled={actionLoading !== null} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{actionLoading ? 'Menyimpan...' : 'Simpan'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Hapus Siswa?</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus siswa <span className="font-semibold">{selectedStudent.name}</span>? Data pendaftaran juga akan terhapus.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
                            <button onClick={handleDeleteStudent} disabled={actionLoading !== null} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">{actionLoading ? 'Menghapus...' : 'Hapus'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Display Modal */}
            {showPasswordModal && selectedStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Key className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Password Baru</h3>
                                <p className="text-xs text-gray-500">{selectedStudent.name}</p>
                            </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-xs text-yellow-800 font-medium mb-2">⚠️ Catat password ini!</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-lg font-mono font-bold text-gray-900 bg-white px-3 py-2 rounded border">
                                    {showPassword ? newPassword : '••••••••'}
                                </code>
                                <button onClick={() => setShowPassword(!showPassword)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => { navigator.clipboard.writeText(newPassword); alert('Password berhasil disalin!') }}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 mb-3 font-medium"
                        >📋 Salin Password</button>
                        <button
                            onClick={() => { setShowPasswordModal(false); setNewPassword(''); setShowPassword(false) }}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >Tutup</button>
                    </div>
                </div>
            )}
        </div>
    )
}
