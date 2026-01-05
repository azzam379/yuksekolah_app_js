import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireRole, extractToken, hashPassword } from '@/lib/auth'

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

        // Verify super_admin role
        const { payload, error, status } = await requireRole(token, ['super_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
        }

        // Prevent self-deletion
        if (payload?.id === userId) {
            return NextResponse.json({ message: 'Tidak dapat menghapus akun sendiri' }, { status: 400 })
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
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

        // Verify super_admin role
        const { payload, error, status } = await requireRole(token, ['super_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { id: userId } })
        if (!existingUser) {
            return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
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
                ...(role && { role })
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
