import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyJWT } from '@/lib/auth'

export async function GET(request: Request) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]
        const payload = await verifyJWT(token)

        if (!payload || !payload.id) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
        }

        // Get user to find school_id
        const user = await prisma.user.findUnique({
            where: { id: payload.id as number }
        })

        if (!user || !user.school_id) {
            return NextResponse.json({ message: 'User has no school' }, { status: 400 })
        }

        // Get all registrations for this school
        const registrations = await prisma.registration.findMany({
            where: { school_id: user.school_id },
            orderBy: { created_at: 'desc' },
            include: {
                student: {
                    select: { id: true, name: true, email: true }
                }
            }
        })

        return NextResponse.json({ data: registrations })

    } catch (error) {
        console.error('Get registrations error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
