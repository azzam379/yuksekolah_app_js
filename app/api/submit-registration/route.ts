import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Form sends: { school_link, form_data: { name, email, phone, program, ... } }
        const { school_link, form_data } = body

        // Validate we have the required data
        if (!school_link || !form_data) {
            return NextResponse.json(
                { message: 'Data pendaftaran tidak lengkap' },
                { status: 400 }
            )
        }

        // Extract student details from form_data
        const { name, email, phone, program } = form_data

        if (!name || !email) {
            return NextResponse.json(
                { message: 'Nama dan email harus diisi' },
                { status: 400 }
            )
        }

        // Find school by registration link
        const school = await prisma.school.findUnique({
            where: { registration_link: school_link }
        })

        if (!school) {
            return NextResponse.json(
                { message: 'Link pendaftaran tidak valid' },
                { status: 404 }
            )
        }

        if (school.status !== 'active') {
            return NextResponse.json(
                { message: 'Sekolah belum aktif' },
                { status: 403 }
            )
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json(
                { message: 'Email sudah terdaftar. Silakan login.' },
                { status: 409 }
            )
        }

        // Generate random password for student
        const plainPassword = randomBytes(4).toString('hex') // 8 character password
        const hashedPassword = await hashPassword(plainPassword)

        // Create student user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'student',
                school_id: school.id
            }
        })

        // Create registration record
        const registration = await prisma.registration.create({
            data: {
                student_id: user.id,
                school_id: school.id,
                program: program || 'Reguler',
                academic_year: new Date().getFullYear().toString(),
                status: 'submitted',
                form_data: JSON.stringify(form_data)
            }
        })

        return NextResponse.json({
            message: 'Pendaftaran siswa berhasil!',
            student_account: {
                email: user.email,
                password: plainPassword // Return plain password so student can login
            },
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            registration: {
                id: registration.id,
                status: registration.status
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Submit registration error:', error)
        return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
    }
}
