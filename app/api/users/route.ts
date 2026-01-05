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

        // Verify role - only super_admin can access all users
        const { payload, error, status } = await requireRole(token, ['super_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
        }

        // Get all users (excluding passwords)
        const users = await prisma.user.findMany({
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                school_id: true,
                created_at: true,
                school: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json({ data: users })

    } catch (error) {
        console.error('Get users error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
