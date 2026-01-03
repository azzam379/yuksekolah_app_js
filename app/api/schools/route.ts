import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
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
