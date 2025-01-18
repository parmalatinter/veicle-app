import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

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
}
