import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { UserProviders } from 'src/entities/providers';

@Module({
  controllers: [TeamController],
  providers: [TeamService, ...UserProviders], // providers para acceder a las entidades
  exports: [TeamService] // Exportamos el servicio por si otros módulos lo necesitan
})
export class TeamModule {}