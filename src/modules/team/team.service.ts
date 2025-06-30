import { Injectable, Inject, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { CreateTeamDto, CreateTeamResponseDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamEntity } from 'src/entities/team.entity';
import { UserEntity } from 'src/entities/user.entity';
import { TeamUserEntity } from 'src/entities/teamUsers.entity';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { EncryptUtil } from 'src/utils/encrypt';

@Injectable()
export class TeamService {
  private readonly encryptUtil: EncryptUtil = new EncryptUtil();
  constructor(
    @Inject('TEAM_REPOSITORY')
    private readonly teamRepository: Repository<TeamEntity>,
    @Inject('USER_TEAM_REPOSITORY') private readonly teamUserRepository: Repository<TeamUserEntity>
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
        roleId: 1
      });
      const hasTeamActive = await this.teamUserRepository.findOne({where: {userId:user.id,isPrincipal:true}});
      if (hasTeamActive) member.isPrincipal = false;
      if (!hasTeamActive) member.isPrincipal = true;
      await this.teamUserRepository.save(member);
      
      return {
        message: 'Team created successfully',
        team: plainToInstance(CreateTeamResponseDto,savedTeam,{excludeExtraneousValues: true})
      };
      
    } catch (error) {
      throw new BadRequestException('Error creating team: ' + error.message);
    }
  }


  async getMyMembers(user:UserEntity,team:TeamEntity) {
    const members =  await this.teamUserRepository.find({where:
      {
        teamId:team.id,
        userId:Not(user.id)
      },relations:{user:true}
    })

      return {
        message: 'members getted successfully',
        members: members
      };
  }













  //#region HELP FUNCTIONS
  async getMyActiveTeam(user:UserEntity) {
    const relation = await this.teamUserRepository.findOne({where:{userId: user.id,isPrincipal:true},relations:{team:true}});
    return relation?.team ?? null;
  }
  //#endregion
}