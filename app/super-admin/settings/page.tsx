'use client'

import { useState } from 'react'
import { Save, Lock, Globe, Bell, Shield } from 'lucide-react'

export default function SystemSettingsPage() {
    const [activeTab, setActiveTab] = useState('general')

    return (
        <div className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pengaturan Sistem</h1>
                <p className="text-sm text-gray-500 mt-1">Konfigurasi global untuk platform YukSekolah.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Settings Sidebar */}
                <div className="w-full md:w-64 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-shrink-0">
                    <nav className="flex flex-col p-2 space-y-1">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'general' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Globe className="w-4 h-4 mr-3" />
                            Umum
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Shield className="w-4 h-4 mr-3" />
                            Keamanan
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Bell className="w-4 h-4 mr-3" />
                            Notifikasi
                        </button>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 w-full space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        {activeTab === 'general' && (
                            <div className="animate-fade-in">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                    <Globe className="w-5 h-5 mr-2 text-gray-400" />
                                    Pengaturan Umum
                                </h2>

                                <div className="space-y-6 max-w-2xl">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Aplikasi</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm" defaultValue="YukSekolah Platform" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Kontak Support</label>
                                        <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm" defaultValue="support@yuksekolah.id" />
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                                            <span className="text-sm text-gray-700">Aktifkan Pendaftaran Sekolah Baru</span>
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1 ml-7">Jika dinonaktifkan, halaman pendaftaran sekolah akan ditutup sementara.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="animate-fade-in">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                    <Shield className="w-5 h-5 mr-2 text-gray-400" />
                                    Keamanan & Akses
                                </h2>
                                <div className="space-y-6 max-w-2xl">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (Menit)</label>
                                        <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm" defaultValue="60" />
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                                            <span className="text-sm text-gray-700">Wajibkan Verifikasi Email untuk Admin Baru</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <Save className="w-4 h-4 mr-2" />
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}