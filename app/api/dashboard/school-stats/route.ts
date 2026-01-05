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

        // Verify role - only school_admin can access school stats
        const { payload, error, status } = await requireRole(token, ['school_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
        }

        // Get user to find school_id
        const user = await prisma.user.findUnique({
            where: { id: payload?.id as number },
            include: { school: true }
        })

        if (!user || !user.school_id) {
            return NextResponse.json({ message: 'User has no school' }, { status: 400 })
        }

        const schoolId = user.school_id

        // Get school info
        const school = await prisma.school.findUnique({
            where: { id: schoolId }
        })

        // Count total registrations for this school
        const totalRegistrations = await prisma.registration.count({
            where: { school_id: schoolId }
        })

        // Count registrations by status
        const pendingVerification = await prisma.registration.count({
            where: { school_id: schoolId, status: 'submitted' }
        })

        const verified = await prisma.registration.count({
            where: { school_id: schoolId, status: 'verified' }
        })

        // Get recent registrations
        const recentRegistrations = await prisma.registration.findMany({
            where: { school_id: schoolId },
            orderBy: { created_at: 'desc' },
            take: 5,
            include: {
                student: {
                    select: { id: true, name: true, email: true }
                }
            }
        })

        return NextResponse.json({
            stats: {
                total_registrations: totalRegistrations,
                pending_verification: pendingVerification,
                verified: verified,
                today_registrations: 0 // TODO: Implement today's count
            },
            school_info: school ? {
                id: school.id,
                name: school.name,
                registration_link: school.registration_link || ''
            } : null,
            recent_registrations: recentRegistrations
        })

    } catch (error) {
        console.error('School stats error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
