import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 1️⃣ Create organization
  const org = await prisma.organization.create({
    data: {
      name: 'TaskForge',
    },
  })

  // 2️⃣ Hash password
  const hashedPassword = await bcrypt.hash('securepass123', 10)

  // 3️⃣ Create user
  const user = await prisma.user.create({
    data: {
      name: 'Owner 2',
      email: 'owner2@taskforge.com',
      password: hashedPassword,
    },
  })

  // 4️⃣ Create membership connecting user to organization
  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId: org.id,
      role: 'OWNER',
    },
  })

  console.log('✅ Seed completed')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })