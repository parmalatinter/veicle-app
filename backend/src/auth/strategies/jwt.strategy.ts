import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const session = await this.prisma.session.findFirst({
      where: {
        user: { id: payload.sub },
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    const { password, ...user } = session.user;
    return user;
  }
}
