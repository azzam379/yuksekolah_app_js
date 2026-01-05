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

        // Verify role - only super_admin can access all schools
        const { payload, error, status } = await requireRole(token, ['super_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
        }

        // Get all schools
        const schools = await prisma.school.findMany({
            orderBy: { created_at: 'desc' }
        })

        return NextResponse.json({ data: schools })

    } catch (error) {
        console.error('Get schools error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
