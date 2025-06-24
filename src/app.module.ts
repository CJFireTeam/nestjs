import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import enviroment from './config/enviroment';
import { ConfigurationModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load:[enviroment],
      envFilePath: '.env',
    }),
  ConfigurationModule,
  AuthModule,
],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
