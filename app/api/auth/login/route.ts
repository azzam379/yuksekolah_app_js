import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyPassword, signJWT } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json({ message: 'Email dan password wajib diisi' }, { status: 400 })
        }

        // 1. Cari user di database
        const user = await prisma.user.findUnique({
            where: { email },
            include: { school: true }
        })

        // 2. Jika user tidak ditemukan
        if (!user) {
            return NextResponse.json({ message: 'Kredensial tidak valid' }, { status: 401 })
        }

        // 3. Verifikasi Password
        const isValid = await verifyPassword(password, user.password)

        if (!isValid) {
            return NextResponse.json({ message: 'Kredensial tidak valid' }, { status: 401 })
        }

        // 4. Buat Token (JWT)
        const token = await signJWT({
            id: user.id,
            email: user.email,
            role: user.role,
            school_id: user.school_id
        })

        // 5. Return Response
        const { password: _, ...userWithoutPassword } = user

        const response = NextResponse.json({
            message: 'Login berhasil',
            token,
            user: userWithoutPassword
        })

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24
        })

        return response

    } catch (error) {
        console.error('[API Login] Error:', error)
        return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
    }
}
