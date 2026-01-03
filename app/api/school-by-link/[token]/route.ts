import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params

        // Find school by registration link
        const school = await prisma.school.findUnique({
            where: { registration_link: token }
        })

        if (!school) {
            return NextResponse.json(
                { message: 'Link pendaftaran tidak valid atau sudah kadaluarsa' },
                { status: 404 }
            )
        }

        if (school.status !== 'active') {
            return NextResponse.json(
                { message: 'Sekolah ini belum aktif' },
                { status: 403 }
            )
        }

        return NextResponse.json({
            school: {
                id: school.id,
                name: school.name,
                address: school.address
            }
        })

    } catch (error) {
        console.error('Get school by link error:', error)
        return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
    }
}
