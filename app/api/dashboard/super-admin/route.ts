import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // Count schools by status
        const totalSchools = await prisma.school.count()
        const pendingSchools = await prisma.school.count({
            where: { status: 'pending' }
        })
        const activeSchools = await prisma.school.count({
            where: { status: 'active' }
        })

        // Count total registrations
        const totalRegistrations = await prisma.registration.count()

        // Get list of pending schools (for the table)
        const pendingSchoolsList = await prisma.school.findMany({
            where: { status: 'pending' },
            orderBy: { created_at: 'desc' },
            take: 10
        })

        return NextResponse.json({
            stats: {
                total_schools: totalSchools,
                pending_schools: pendingSchools,
                active_schools: activeSchools,
                total_registrations: totalRegistrations
            },
            pending_schools: pendingSchoolsList
        })

    } catch (error) {
        console.error('Dashboard API error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
