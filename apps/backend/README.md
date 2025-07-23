# Backend API with OAuth Authentication

This NestJS backend provides OAuth2 authentication endpoints.

## Environment Variables

Create a `.env` file in the `apps/backend/` directory with the following variables:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OAuth2 Configuration
OAUTH_AUTH_URL=https://your-oauth-provider.com/oauth/authorize
OAUTH_TOKEN_URL=https://your-oauth-provider.com/oauth/token
OAUTH_CLIENT_ID=your-oauth-client-id
OAUTH_CLIENT_SECRET=your-oauth-client-secret
OAUTH_CALLBACK_URL=http://localhost:3000/api/auth/callback
OAUTH_SCOPE=openid email profile

# Server Configuration
PORT=3000
```

## API Endpoints

### Authentication Endpoints

- `GET /api/auth/login` - Initiate OAuth login (redirects to OAuth provider)
- `GET /api/auth/callback` - OAuth callback endpoint
- `GET /api/auth/profile` - Get user profile (requires JWT token)
- `POST /api/auth/verify` - Verify JWT token
- `GET /api/auth/logout` - Logout endpoint

### Protected Routes

To protect a route with JWT authentication, use the `@UseGuards(JwtAuthGuard)` decorator:

```typescript
@Get('protected')
@UseGuards(JwtAuthGuard)
getProtectedData() {
  return { message: 'This is protected data' };
}
```

## Running the Backend

```bash
# Development
npx nx serve backend

# Production build
npx nx build backend

# Test
npx nx test backend
```

## OAuth Provider Setup

1. Register your application with your OAuth provider (Google, GitHub, etc.)
2. Set the callback URL to: `http://localhost:3000/api/auth/callback`
3. Copy the client ID and client secret to your `.env` file
4. Update the OAuth URLs to match your provider's endpoints

## Example OAuth Providers

### Google OAuth2

```env
OAUTH_AUTH_URL=https://accounts.google.com/o/oauth2/v2/auth
OAUTH_TOKEN_URL=https://oauth2.googleapis.com/token
```

### GitHub OAuth2

```env
OAUTH_AUTH_URL=https://github.com/login/oauth/authorize
OAUTH_TOKEN_URL=https://github.com/login/oauth/access_token
```
