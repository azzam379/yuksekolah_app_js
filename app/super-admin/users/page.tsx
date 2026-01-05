'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Filter, Plus, X, Shield, Mail, UserCheck, Trash2, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react'

interface User {
    id: number
    name: string
    email: string
    role: string
    school_id?: number
    created_at: string
    school?: { name: string }
}

export default function UserManagementPage() {
    const { token } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Form states
    const [formData, setFormData] = useState({ name: '', email: '', role: 'student', school_id: '' })

    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!response.ok) throw new Error('Gagal mengambil data user')
            const data = await response.json()
            setUsers(data.data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
            setUsers([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchUsers()
    }, [token])

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    // Create User
    const handleCreateUser = async () => {
        try {
            setActionLoading(true)
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message)

            setNewPassword(data.password)
            setShowCreateModal(false)
            setShowPasswordModal(true)
            fetchUsers()
            setFormData({ name: '', email: '', role: 'student', school_id: '' })
        } catch (error: any) {
            alert(error.message || 'Gagal membuat user')
        } finally {
            setActionLoading(false)
        }
    }

    // Edit User
    const handleEditUser = async () => {
        if (!selectedUser) return
        try {
            setActionLoading(true)
            const response = await fetch(`/api/users/${selectedUser.id}`, {
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
            fetchUsers()
            alert('User berhasil diupdate')
        } catch (error: any) {
            alert(error.message || 'Gagal update user')
        } finally {
            setActionLoading(false)
        }
    }

    // Delete User
    const handleDeleteUser = async () => {
        if (!selectedUser) return
        try {
            setActionLoading(true)
            const response = await fetch(`/api/users/${selectedUser.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message)

            setShowDeleteModal(false)
            fetchUsers()
            alert('User berhasil dihapus')
        } catch (error: any) {
            alert(error.message || 'Gagal menghapus user')
        } finally {
            setActionLoading(false)
        }
    }

    // Reset Password
    const handleResetPassword = async (user: User) => {
        try {
            setActionLoading(true)
            const response = await fetch(`/api/users/${user.id}/reset-password`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message)

            setSelectedUser(user)
            setNewPassword(data.new_password)
            setShowPasswordModal(true)
        } catch (error: any) {
            alert(error.message || 'Gagal reset password')
        } finally {
            setActionLoading(false)
        }
    }

    const openEditModal = (user: User) => {
        setSelectedUser(user)
        setFormData({ name: user.name, email: user.email, role: user.role, school_id: user.school_id?.toString() || '' })
        setShowEditModal(true)
    }

    const openDeleteModal = (user: User) => {
        setSelectedUser(user)
        setShowDeleteModal(true)
    }

    const getRoleBadge = (role: string) => {
        const styles: Record<string, string> = {
            super_admin: 'bg-purple-50 text-purple-700 border-purple-100',
            school_admin: 'bg-blue-50 text-blue-700 border-blue-100',
            student: 'bg-gray-100 text-gray-800 border-gray-200'
        }
        const labels: Record<string, string> = {
            super_admin: 'Super Admin',
            school_admin: 'School Admin',
            student: 'Student'
        }
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${styles[role] || styles.student}`}>
                {labels[role] || role}
            </span>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen User</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola akses dan role pengguna sistem.</p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ name: '', email: '', role: 'student', school_id: '' })
                        setShowCreateModal(true)
                    }}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
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
                            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Cari nama atau email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            className="block w-full sm:w-auto p-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 bg-white"
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
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sekolah</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal Gabung</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">Memuat data user...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">Tidak ada user ditemukan.</td></tr>
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
                                                        <Mail className="w-3 h-3 mr-1" />{user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{user.school?.name || '-'}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => handleResetPassword(user)}
                                                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                                    title="Reset Password"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit User"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(user)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete User"
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

                {/* Pagination */}
                {!isLoading && filteredUsers.length > 0 && (
                    <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <div className="text-xs text-gray-500">Menampilkan <span className="font-medium">{filteredUsers.length}</span> user</div>
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Tambah User Baru</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="student">Student</option>
                                    <option value="school_admin">School Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
                            <button onClick={handleCreateUser} disabled={actionLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{actionLoading ? 'Menyimpan...' : 'Simpan'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="student">Student</option>
                                    <option value="school_admin">School Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
                            <button onClick={handleEditUser} disabled={actionLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{actionLoading ? 'Menyimpan...' : 'Simpan'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Hapus User?</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus user <span className="font-semibold">{selectedUser.name}</span>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
                            <button onClick={handleDeleteUser} disabled={actionLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">{actionLoading ? 'Menghapus...' : 'Hapus'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Display Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Key className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Password User</h3>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-xs text-yellow-800 font-medium mb-2">⚠️ PENTING: Catat password ini!</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-lg font-mono font-bold text-gray-900 bg-white px-3 py-2 rounded border">
                                    {showPassword ? newPassword : '••••••••'}
                                </code>
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-yellow-700 mt-2">Password tidak akan ditampilkan lagi setelah modal ini ditutup.</p>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(newPassword)
                                alert('Password berhasil disalin!')
                            }}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 mb-3 font-medium"
                        >
                            📋 Salin Password
                        </button>
                        <button
                            onClick={() => {
                                setShowPasswordModal(false)
                                setNewPassword('')
                                setShowPassword(false)
                            }}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}