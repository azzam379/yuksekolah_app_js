import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireRole, extractToken, hashPassword, verifyJWT } from '@/lib/auth'

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
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

        // Prevent self-deletion
        if (payload?.id === userId) {
            return NextResponse.json({ message: 'Tidak dapat menghapus akun sendiri' }, { status: 400 })
        }

        // Check if user exists
        const targetUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!targetUser) {
            return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
        }

        // School admin can only delete students in their school
        if (payload?.role === 'school_admin') {
            if (targetUser.role !== 'student') {
                return NextResponse.json({ message: 'School admin hanya dapat menghapus akun siswa' }, { status: 403 })
            }
            if (targetUser.school_id !== payload.school_id) {
                return NextResponse.json({ message: 'Siswa bukan dari sekolah Anda' }, { status: 403 })
            }
        }

        // Delete user (cascade will handle related records)
        await prisma.user.delete({ where: { id: userId } })

        return NextResponse.json({ message: 'User berhasil dihapus' })

    } catch (error) {
        console.error('Delete user error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/users/[id] - Update user info
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const userId = parseInt(id)
        const body = await request.json()
        const { name, email, role } = body

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
        const existingUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!existingUser) {
            return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
        }

        // School admin can only update students in their school
        if (payload?.role === 'school_admin') {
            if (existingUser.role !== 'student') {
                return NextResponse.json({ message: 'School admin hanya dapat mengedit akun siswa' }, { status: 403 })
            }
            if (existingUser.school_id !== payload.school_id) {
                return NextResponse.json({ message: 'Siswa bukan dari sekolah Anda' }, { status: 403 })
            }
            // School admin cannot change role
            if (role && role !== 'student') {
                return NextResponse.json({ message: 'School admin tidak dapat mengubah role siswa' }, { status: 403 })
            }
        }

        // Check email uniqueness if changing email
        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({ where: { email } })
            if (emailExists) {
                return NextResponse.json({ message: 'Email sudah digunakan user lain' }, { status: 409 })
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(role && payload?.role === 'super_admin' && { role })
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true
            }
        })

        return NextResponse.json({
            message: 'User berhasil diupdate',
            user: updatedUser
        })

    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
