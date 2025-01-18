import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Headers,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try {
      const result = await this.authService.login(req.user);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Login controller error:', error);
      throw new HttpException(
        {
          success: false,
          message: error.message || 'ログインに失敗しました',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('logout')
  async logout(@Headers('authorization') auth: string) {
    try {
      if (auth?.startsWith('Bearer ')) {
        const token = auth.substring(7);
        await this.authService.logout(token);
      }
      return {
        success: true,
        message: 'ログアウトしました',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'ログアウトに失敗しました',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    try {
      const user = await this.authService.findById(req.user.id);
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'ユーザー情報の取得に失敗しました',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
