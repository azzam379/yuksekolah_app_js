import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const registrationId = parseInt(id)

        // Get authorization header
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // Update registration status to rejected
        const registration = await prisma.registration.update({
            where: { id: registrationId },
            data: { status: 'rejected' }
        })

        return NextResponse.json({
            message: 'Pendaftaran ditolak',
            registration
        })

    } catch (error) {
        console.error('Reject registration error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
