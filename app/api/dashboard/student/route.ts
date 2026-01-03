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

        // Get user with school
        const user = await prisma.user.findUnique({
            where: { id: payload.id as number },
            include: { school: true }
        })

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 })
        }

        // Get the latest registration for this student
        const registration = await prisma.registration.findFirst({
            where: { student_id: user.id },
            orderBy: { created_at: 'desc' },
            include: {
                school: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true
                    }
                }
            }
        })

        // Parse form_data if exists
        let formData = {}
        if (registration?.form_data) {
            try {
                formData = JSON.parse(registration.form_data)
            } catch (e) {
                formData = {}
            }
        }

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            registration: registration ? {
                id: registration.id,
                school_id: registration.school_id,
                program: registration.program,
                academic_year: registration.academic_year,
                status: registration.status,
                created_at: registration.created_at,
                updated_at: registration.updated_at,
                form_data: formData,
                school: registration.school
            } : null,
            school: registration?.school || user.school || null
        })

    } catch (error) {
        console.error('Student dashboard error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
