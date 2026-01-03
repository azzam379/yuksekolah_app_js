import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { randomBytes } from 'crypto'

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

        // Generate unique registration link
        const registrationLink = randomBytes(16).toString('hex')

        // Update school status to active
        const school = await prisma.school.update({
            where: { id: schoolId },
            data: {
                status: 'active',
                verified_at: new Date(),
                registration_link: registrationLink
            }
        })

        return NextResponse.json({
            message: 'Sekolah berhasil diverifikasi',
            school,
            registration_link: `/register/${registrationLink}`
        })

    } catch (error) {
        console.error('Verify school error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
