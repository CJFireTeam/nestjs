import {
  Injectable,
  Inject,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { CreateTeamDto, CreateTeamResponseDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamEntity } from 'src/entities/team.entity';
import { UserEntity } from 'src/entities/user.entity';
import { TeamUserEntity } from 'src/entities/teamUsers.entity';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { EncryptUtil } from 'src/utils/encrypt';
import { PaginationUtil } from 'src/utils/pagination.util';
import { meRespondeRole, meResponseDto } from '../auth/dto/meResponse.dto';
import { ModulesEntity } from 'src/entities/modules.entity';
import { TeamModuleEntity } from 'src/entities/teamModules.entity';

@Injectable()
export class TeamService {
  private readonly encryptUtil: EncryptUtil = new EncryptUtil();
  constructor(
    @Inject('TEAM_REPOSITORY')
    private readonly teamRepository: Repository<TeamEntity>,
    @Inject('USER_TEAM_REPOSITORY')
    private readonly teamUserRepository: Repository<TeamUserEntity>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<UserEntity>,
    @Inject('MODULE_REPOSITORY')
    private readonly modulesRepository: Repository<ModulesEntity>,
    @Inject('TEAM_MODULES_REPOSITORY')
    private readonly teamModulesRepository: Repository<TeamModuleEntity>,
  ) {}

  async create(createTeamDto: CreateTeamDto, user: UserEntity) {
    try {
      const link = await this.encryptUtil.generateUUID();
      const team = this.teamRepository.create({
        ...createTeamDto,
        creator: user,
        creatorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        inviteLink: link,
      });
      const savedTeam = await this.teamRepository.save(team);

      const member = await this.teamUserRepository.create({
        isActive: true,
        userId: user.id,
        teamId: savedTeam.id,
        roleId: 1,
      });
      const hasTeamActive = await this.teamUserRepository.findOne({
        where: { userId: user.id, isPrincipal: true },
      });
      if (hasTeamActive) member.isPrincipal = false;
      if (!hasTeamActive) member.isPrincipal = true;
      await this.teamUserRepository.save(member);

      return {
        message: 'Team created successfully',
        team: plainToInstance(CreateTeamResponseDto, savedTeam, {
          excludeExtraneousValues: true,
        }),
      };
    } catch (error) {
      throw new BadRequestException('Error creating team: ' + error.message);
    }
  }

  async getMyMembers(
    user: UserEntity,
    team: TeamEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const myTeams: any[] = [];

      // Usar tu util de paginación existente
      const paginatedResult = await PaginationUtil.paginate(
        this.userRepository,
        {
          where: {
            id: Not(user.id),
            myTeams: { team: { id: team.id }, isActive: true },
          },
          relations: { myTeams: { role: true } },
        },
        { page, limit },
      );
      const recalculatedData = paginatedResult.data.map((member) => {
        return plainToInstance(
          meRespondeRole,
          { ...member, role: member.myTeams[0].role.name },
          { excludeExtraneousValues: true },
        );
      });

      return {
        message: 'Members retrieved successfully',
        members: recalculatedData,
        meta: paginatedResult.meta,
      };
    } catch (error) {
      throw new BadRequestException('Error getting members: ' + error.message);
    }
  }

  // Obtener todos los módulos que mi equipo NO tiene
  async getAvailableModules(
    user: UserEntity,
    team: TeamEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      // Obtener los IDs de módulos que ya tiene el equipo
      const teamModules = await this.teamModulesRepository.find({
        where: { teamId: team.id },
        select: ['moduleId'],
      });

      const teamModuleIds = teamModules.map((tm) => tm.moduleId);

      // Construir la condición WHERE para excluir los módulos del equipo
      const whereCondition: any = {
        status: true, // Solo módulos activos
        forTeams: true, // Solo módulos para equipos
      };

      // Si el equipo tiene módulos, excluirlos
      if (teamModuleIds.length > 0) {
        whereCondition.id = Not(In(teamModuleIds));
      }

      // Usar util de paginación existente
      const paginatedResult = await PaginationUtil.paginate(
        this.modulesRepository,
        {
          where: whereCondition,
          order: { name: 'ASC' },
        },
        { page, limit },
      );

      return {
        message: 'Available modules retrieved successfully',
        modules: paginatedResult.data,
        meta: paginatedResult.meta,
      };
    } catch (error) {
      throw new BadRequestException(
        'Error getting available modules: ' + error.message,
      );
    }
  }

  // Obtener todos los módulos que mi equipo SÍ tiene
  async getTeamModules(
    user: UserEntity,
    team: TeamEntity,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      // Usar tu util de paginación con join
      const paginatedResult = await PaginationUtil.paginate(
        this.teamModulesRepository,
        {
          where: { teamId: team.id },
          relations: { module: true },
          order: { addedAt: 'DESC' },
        },
        { page, limit },
      );

      // Mapear para devolver solo la información del módulo con fecha de agregado
      const teamModulesData = paginatedResult.data.map((tm) => ({
        ...tm.module,
        addedAt: tm.addedAt,
      }));

      return {
        message: 'Team modules retrieved successfully',
        modules: teamModulesData,
        meta: paginatedResult.meta,
      };
    } catch (error) {
      throw new BadRequestException(
        'Error getting team modules: ' + error.message,
      );
    }
  }

  //#region HELP FUNCTIONS
  async getMyActiveTeam(user: UserEntity) {
    const relation = await this.teamUserRepository.findOne({
      where: { userId: user.id, isPrincipal: true },
      relations: { team: true },
    });
    return relation?.team ?? null;
  }
  //#endregion
}
