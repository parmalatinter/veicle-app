import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 既存のユーザーを確認
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    // 管理者ユーザーの作成
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: hashedPassword,
          name: 'Admin User',
          isAdmin: true,
        },
      });
      console.log('Created admin user');
    }

    // 一般ユーザーの作成
    const existingUser = await prisma.user.findUnique({
      where: { email: 'user@example.com' },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: 'user@example.com',
          password: hashedPassword,
          name: 'Regular User',
          isAdmin: false,
        },
      });
      console.log('Created regular user');
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
