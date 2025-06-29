import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtGuard } from 'src/guard/jwt/jwt.guard';

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
  @UseGuards(JwtGuard)
  findAll(@Request() req) {
    // Solo mostrar los equipos del usuario autenticado
    return this.teamService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.teamService.findOne(+id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto, @Request() req) {
    return this.teamService.update(+id, updateTeamDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.teamService.remove(+id, req.user);
  }
}