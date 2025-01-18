import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error('Find user by email error:', error);
      throw error;
    }
  }

  async createUser(email: string, password: string, name?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
  }
}
