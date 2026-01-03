import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('yuksekolah123', 10)

    const user = await prisma.user.upsert({
        where: { email: 'azzammadu37@gmail.com' },
        update: {},
        create: {
            email: 'azzammadu37@gmail.com',
            name: 'Musa',
            password,
            role: 'super_admin',
        },
    })

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
