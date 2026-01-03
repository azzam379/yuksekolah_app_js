import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
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
