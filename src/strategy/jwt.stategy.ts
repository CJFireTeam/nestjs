import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // 👈 Importar ConfigService
import { Repository } from 'typeorm';
import { TokenEntity } from 'src/entities/token.entity';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      passReqToCallback: true, // 👈 Permite acceder a la Request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // 👈 Usar config
    });
  }

  async validate(req,payload: any) {
    const authHeader = req.headers['authorization'];
    const validating = await this.authService.validateToken(authHeader?.replace(/^Bearer\s+/i, '').trim(), payload.sub);
    if (!validating) {
      throw new UnauthorizedException();
    }

    return {
      sub: payload.sub,
      name: payload.name,
      role: payload.role,
      me: validating
    };
  }
}
