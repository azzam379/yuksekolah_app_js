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

        // Verify super_admin role
        const { payload, error, status } = await requireRole(token, ['super_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
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
