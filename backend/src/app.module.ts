import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    HealthModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
