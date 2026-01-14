import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('securepass123', 10)

  const org = await prisma.organization.create({
    data: { name: 'TaskForge' },
  })

  const user = await prisma.user.create({
    data: {
      email: 'owner2@taskforge.com',
      name: 'Owner 2',
      password: hashedPassword,
    },
  })

  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId: org.id,
      role: 'owner',
    },
  })

  console.log('Seed complete')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())