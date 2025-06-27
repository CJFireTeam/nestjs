import { Injectable, Inject, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamEntity } from 'src/entities/team.entity';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class TeamService {
  constructor(
    @Inject('TEAM_REPOSITORY')
    private readonly teamRepository: Repository<TeamEntity>,
  ) {}

  async create(createTeamDto: CreateTeamDto, user: UserEntity) {
    try {
      // Creamos el equipo asignando el usuario como creador
      const team = this.teamRepository.create({
        ...createTeamDto,
        creator: user,
        creatorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [user] // El creador también es miembro del equipo
      });

      const savedTeam = await this.teamRepository.save(team);
      
      return {
        message: 'Team created successfully',
        team: savedTeam
      };
    } catch (error) {
      throw new BadRequestException('Error creating team: ' + error.message);
    }
  }

  async findAll(user: UserEntity) {
    try {
      // Obtenemos todos los equipos donde el usuario es creador o miembro
      const teams = await this.teamRepository
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.creator', 'creator')
        .leftJoinAndSelect('team.members', 'members')
        .where('team.creatorId = :userId', { userId: user.id })
        .orWhere('members.id = :userId', { userId: user.id })
        .getMany();

      return {
        message: 'Teams retrieved successfully',
        teams: teams
      };
    } catch (error) {
      throw new BadRequestException('Error fetching teams: ' + error.message);
    }
  }

  async findOne(id: number, user: UserEntity) {
    try {
      const team = await this.teamRepository
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.creator', 'creator')
        .leftJoinAndSelect('team.members', 'members')
        .where('team.id = :id', { id })
        .andWhere('(team.creatorId = :userId OR members.id = :userId)', { userId: user.id })
        .getOne();

      if (!team) {
        throw new NotFoundException('Team not found or you do not have access to it');
      }

      return {
        message: 'Team retrieved successfully',
        team: team
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error fetching team: ' + error.message);
    }
  }

  async update(id: number, updateTeamDto: UpdateTeamDto, user: UserEntity) {
    try {
      const team = await this.teamRepository.findOne({
        where: { id },
        relations: ['creator']
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      // Solo el creador puede actualizar el equipo
      if (team.creatorId !== user.id) {
        throw new ForbiddenException('You can only update teams you created');
      }

      // Actualizar los campos
      Object.assign(team, updateTeamDto);
      team.updatedAt = new Date();

      const updatedTeam = await this.teamRepository.save(team);

      return {
        message: 'Team updated successfully',
        team: updatedTeam
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Error updating team: ' + error.message);
    }
  }

  async remove(id: number, user: UserEntity) {
    try {
      const team = await this.teamRepository.findOne({
        where: { id },
        relations: ['creator']
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      // Solo el creador puede eliminar el equipo
      if (team.creatorId !== user.id) {
        throw new ForbiddenException('You can only delete teams you created');
      }

      await this.teamRepository.remove(team);

      return {
        message: 'Team deleted successfully'
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Error deleting team: ' + error.message);
    }
  }
}