import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const schoolId = parseInt(id)

        // Get authorization header
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // Delete the school (or mark as inactive, depending on requirements)
        await prisma.school.delete({
            where: { id: schoolId }
        })

        return NextResponse.json({
            message: 'Sekolah berhasil ditolak dan dihapus'
        })

    } catch (error) {
        console.error('Reject school error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
