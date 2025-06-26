import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserProviders } from 'src/entities/providers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/strategy/local.strategy';
import { JwtStrategy } from 'src/strategy/jwt.stategy';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtExpiredFilter } from 'src/filter/jwtExpire.filter';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ...UserProviders,LocalStrategy, JwtStrategy,{
      provide: APP_INTERCEPTOR,
      useClass: JwtExpiredFilter,
    },],
})
export class AuthModule { }
