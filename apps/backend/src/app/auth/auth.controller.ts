import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  @UseGuards(AuthGuard('oauth2'))
  async login() {
    // This will redirect to OAuth provider
    return;
  }

  @Get('callback')
  @UseGuards(AuthGuard('oauth2'))
  async authCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const user = req.user;
      const result = await this.authService.login(user);

      // In a real application, you might want to redirect to frontend with token
      // For now, we'll return the token in response
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('verify')
  async verifyToken(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);
    const payload = await this.authService.verifyToken(token);

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    return { valid: true, user: payload };
  }

  @Get('logout')
  logout(@Res() res: Response) {
    // In a real application, you might want to invalidate the token
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }
}
