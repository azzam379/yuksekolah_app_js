import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        // Form sends: school_name, school_email, school_phone, school_address, admin_name, admin_email, admin_password
        const {
            school_name,
            school_email,
            school_phone,
            school_address,
            admin_name,
            admin_email,
            admin_password
        } = body

        // Validate required fields
        if (!school_name || !admin_name || !admin_email || !admin_password) {
            return NextResponse.json(
                { message: 'Nama sekolah, nama admin, email, dan password wajib diisi' },
                { status: 400 }
            )
        }

        // Check if email already exists (for school or user)
        const existingSchool = await prisma.school.findUnique({ where: { email: school_email } })
        if (existingSchool) {
            return NextResponse.json(
                { message: 'Email sekolah sudah terdaftar' },
                { status: 409 }
            )
        }

        const existingUser = await prisma.user.findUnique({ where: { email: admin_email } })
        if (existingUser) {
            return NextResponse.json(
                { message: 'Email admin sudah terdaftar' },
                { status: 409 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(admin_password)

        // Create school with pending status
        const school = await prisma.school.create({
            data: {
                name: school_name,
                email: school_email,
                phone: school_phone,
                address: school_address,
                status: 'pending'
            }
        })

        // Create school admin user
        const user = await prisma.user.create({
            data: {
                name: admin_name,
                email: admin_email,
                password: hashedPassword,
                role: 'school_admin',
                school_id: school.id
            }
        })

        return NextResponse.json({
            message: 'Pendaftaran sekolah berhasil! Menunggu verifikasi admin.',
            school: {
                id: school.id,
                name: school.name,
                status: school.status
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Register school error:', error)
        return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
    }
}
