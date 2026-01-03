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

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: payload.id as number },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                school_id: true,
                school: true
            }
        })

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ user })

    } catch (error) {
        console.error('Get me error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
