import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireRole, extractToken } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        // Get authorization header
        const token = extractToken(request.headers.get('Authorization'))
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // Verify role - school_admin and super_admin can access registrations
        const { payload, error, status } = await requireRole(token, ['school_admin', 'super_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
        }

        // Get user to find school_id
        const user = await prisma.user.findUnique({
            where: { id: payload?.id as number }
        })

        if (!user) {
            return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
        }

        // Super admin can see all registrations, school_admin only sees their school's
        let whereClause = {}
        if (user.role === 'school_admin' && user.school_id) {
            whereClause = { school_id: user.school_id }
        }

        // Get registrations based on role
        const registrations = await prisma.registration.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' },
            include: {
                student: {
                    select: { id: true, name: true, email: true }
                },
                school: {
                    select: { id: true, name: true }
                }
            }
        })

        return NextResponse.json({ data: registrations })

    } catch (error) {
        console.error('Get registrations error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
