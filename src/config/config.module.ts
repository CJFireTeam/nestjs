
import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  providers: [...databaseProviders,],
  exports: [...databaseProviders],
})
export class ConfigurationModule {}
