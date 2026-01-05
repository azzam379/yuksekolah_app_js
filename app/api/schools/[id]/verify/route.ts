import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { randomBytes } from 'crypto'
import { requireRole, extractToken } from '@/lib/auth'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const schoolId = parseInt(id)

        // Get authorization header
        const token = extractToken(request.headers.get('Authorization'))
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // Verify role - only super_admin can verify schools
        const { payload, error, status } = await requireRole(token, ['super_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
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
