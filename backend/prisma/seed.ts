import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const initialUsers = [
    {
      email: 'admin@example.com',
      password: hashedPassword,
      name: '管理者',
      isAdmin: true,
      isActive: true,
      lastLoginAt: new Date(),
    },
    {
      email: 'user@example.com',
      password: hashedPassword,
      name: '一般ユーザー',
      isAdmin: false,
      isActive: true,
      lastLoginAt: new Date(),
    },
  ];

  console.log('Seeding database...');

  for (const userData of initialUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: userData,
      });
      console.log(`Created user: ${userData.email}`);
    } else {
      console.log(`User already exists: ${userData.email}`);
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
