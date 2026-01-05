import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireRole, extractToken, hashPassword } from '@/lib/auth'
import { randomBytes } from 'crypto'

// POST /api/users/[id]/reset-password - Reset user password
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const userId = parseInt(id)

        // Get authorization
        const token = extractToken(request.headers.get('Authorization'))
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // Verify role - super_admin or school_admin
        const { payload, error, status } = await requireRole(token, ['super_admin', 'school_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
        }

        // Check if user exists
        const targetUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!targetUser) {
            return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
        }

        // School admin can only reset password for students in their school
        if (payload?.role === 'school_admin') {
            if (targetUser.role !== 'student') {
                return NextResponse.json({ message: 'School admin hanya dapat reset password siswa' }, { status: 403 })
            }
            if (targetUser.school_id !== payload.school_id) {
                return NextResponse.json({ message: 'Siswa bukan dari sekolah Anda' }, { status: 403 })
            }
        }

        // Generate new random password
        const newPassword = randomBytes(4).toString('hex') // 8 character password
        const hashedPassword = await hashPassword(newPassword)

        // Update user password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })

        return NextResponse.json({
            message: 'Password berhasil direset',
            new_password: newPassword,
            warning: 'Catat password baru ini! Password tidak akan ditampilkan lagi setelah halaman ditutup.'
        })

    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
