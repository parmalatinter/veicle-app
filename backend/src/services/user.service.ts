import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, GooglePlaySubscription } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async restoreFromGooglePlay(googleUserId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { googleUserId },
          {
            googlePlaySubscriptions: {
              some: { googleUserId },
            },
          },
        ],
      },
      include: {
        googlePlaySubscriptions: true,
      },
    });

    if (user) {
      await this.verifyGooglePlaySubscriptions(user);
      return user;
    }

    return null;
  }

  async verifyGooglePlaySubscriptions(
    user: User & { googlePlaySubscriptions: GooglePlaySubscription[] },
  ) {
    for (const sub of user.googlePlaySubscriptions) {
      // Google Play Developer APIを使用して購入を検証
      const isValid = await this.verifySubscription(
        sub.packageName,
        sub.subscriptionId,
        sub.purchaseToken,
      );

      await this.prisma.googlePlaySubscription.update({
        where: { id: sub.id },
        data: {
          status: isValid ? 'active' : 'expired',
          lastVerifiedAt: new Date(),
        },
      });
    }
  }

  private async verifySubscription(
    packageName: string,
    subscriptionId: string,
    purchaseToken: string,
  ) {
    // TODO: Google Play Developer APIの実装
    return true;
  }
}
