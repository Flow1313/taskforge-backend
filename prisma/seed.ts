import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('securepass123', 10)

  await prisma.user.upsert({
    where: { email: 'owner2@taskforge.com' },
    update: {},
    create: {
      email: 'owner2@taskforge.com',
      name: 'Owner Two',
      password: hashedPassword,
      role: 'OWNER',
    },
  })

  console.log('✅ User seeded successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())