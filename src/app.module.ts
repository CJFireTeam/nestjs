import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import enviroment from './config/enviroment';
import { ConfigurationModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './modules/auth/auth.service';
import { UserProviders } from './entities/providers';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.stategy';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtExpiredFilter } from './filter/jwtExpire.filter';
import { PassportModule } from '@nestjs/passport';
import { TeamModule } from './modules/team/team.module';
import { SeederModule } from './seeder/seeder.module';
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
    ConfigModule.forRoot({
      isGlobal: true,
      load: [enviroment],
      envFilePath: '.env',
    }),
    ConfigurationModule,
    AuthModule,
    TeamModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    AuthService, ...UserProviders, LocalStrategy, JwtStrategy, {
      provide: APP_INTERCEPTOR,
      useClass: JwtExpiredFilter,
    },
    
  ],
  exports: [JwtModule]
})

export class AppModule { }
