import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtGuard } from 'src/guard/jwt/jwt.guard';
import { TeamGuard } from 'src/guard/team/team.guard';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(JwtGuard) // Guard para obtener el usuario del token
  create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    // Pasamos el usuario autenticado al servicio
    return this.teamService.create(createTeamDto, req.user.me);
  }

  @Get()
  @UseGuards(JwtGuard, TeamGuard)
  getMembers(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.teamService.getMyMembers(req.user.me, req.team, page, limit);
  }

  // Endpoint para obtener módulos disponibles (que el equipo NO tiene)
  @Get('modules/available')
  @UseGuards(JwtGuard, TeamGuard)
  getAvailableModules(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.teamService.getAvailableModules(
      req.user.me,
      req.team,
      page,
      limit,
    );
  }

  // Endpoint para obtener módulos del equipo (que el equipo SÍ tiene)
  @Get('modules')
  @UseGuards(JwtGuard, TeamGuard)
  getTeamModules(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.teamService.getTeamModules(req.user.me, req.team, page, limit);
  }
}
