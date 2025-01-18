import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../services/prisma.service';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException(
          'メールアドレスまたはパスワードが正しくありません',
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'メールアドレスまたはパスワードが正しくありません',
        );
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error('User validation error:', error);
      throw error;
    }
  }

  async login(user: any) {
    try {
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);

      // セッションを作成
      await this.prisma.session.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7日後
        },
      });

      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(token: string) {
    await this.prisma.session.delete({
      where: { token },
    });
  }

  async findById(id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException('ユーザーが見つかりません');
    }
    return user;
  }
}
