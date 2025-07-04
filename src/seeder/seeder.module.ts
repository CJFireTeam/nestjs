import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { UserProviders } from 'src/entities/providers';

@Module({
  controllers: [SeederController],
  providers: [SeederService,...UserProviders],
})
export class SeederModule {}
