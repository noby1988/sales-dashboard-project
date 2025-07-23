import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      authorizationURL: configService.get<string>('OAUTH_AUTH_URL'),
      tokenURL: configService.get<string>('OAUTH_TOKEN_URL'),
      clientID: configService.get<string>('OAUTH_CLIENT_ID'),
      clientSecret: configService.get<string>('OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get<string>('OAUTH_CALLBACK_URL'),
      scope: configService.get<string>('OAUTH_SCOPE', 'openid email profile'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) {
    try {
      // In a real application, you would fetch user profile from OAuth provider
      // For now, we'll use the profile passed from the callback
      const user = await this.authService.validateOAuthUser(profile, 'oauth2');
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
}
