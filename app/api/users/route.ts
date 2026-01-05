import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireRole, extractToken, hashPassword } from '@/lib/auth'
import { randomBytes } from 'crypto'

export async function GET(request: Request) {
    try {
        // Get authorization header
        const token = extractToken(request.headers.get('Authorization'))
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // Verify role - only super_admin can access all users
        const { payload, error, status } = await requireRole(token, ['super_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
        }

        // Get all users (excluding passwords)
        const users = await prisma.user.findMany({
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                school_id: true,
                created_at: true,
                school: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json({ data: users })

    } catch (error) {
        console.error('Get users error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/users - Create new user
export async function POST(request: Request) {
    try {
        const token = extractToken(request.headers.get('Authorization'))
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // Verify super_admin role
        const { payload, error, status } = await requireRole(token, ['super_admin'])
        if (error) {
            return NextResponse.json({ message: error }, { status: status || 403 })
        }

        const body = await request.json()
        const { name, email, role, school_id } = body

        // Validate required fields
        if (!name || !email || !role) {
            return NextResponse.json({ message: 'Nama, email, dan role wajib diisi' }, { status: 400 })
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 409 })
        }

        // Generate random password
        const plainPassword = randomBytes(4).toString('hex')
        const hashedPassword = await hashPassword(plainPassword)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                school_id: school_id || null
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true
            }
        })

        return NextResponse.json({
            message: 'User berhasil dibuat',
            user,
            password: plainPassword,
            warning: 'Catat password ini! Password tidak akan ditampilkan lagi.'
        }, { status: 201 })

    } catch (error) {
        console.error('Create user error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
