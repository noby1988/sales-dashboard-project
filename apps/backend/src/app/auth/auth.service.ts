import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface User {
  id: string;
  email: string;
  name: string;
  provider: string;
  avatar?: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateOAuthUser(profile: any, provider: string): Promise<User> {
    // In a real application, you would save/update user in database here
    const user: User = {
      id: profile.id || profile.sub,
      email: profile.email,
      name: profile.name || profile.displayName,
      provider,
      avatar: profile.picture || profile.avatar_url,
    };

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      provider: user.provider,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatar: user.avatar,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
