import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
/* import { Auth } from './entities/auth.entity'; */
import { EncryptUtil } from 'src/utils/encrypt';
import { MoreThan, Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { RolesEntity } from 'src/entities/role.entity';
import { OtpEntity } from 'src/entities/otp.entity';
import { OtpUtil } from 'src/utils/otp';
import { TeamEntity } from 'src/entities/team.entity';
import { ConfigService } from '@nestjs/config';
import { ConfirmParamsDto } from './dto/confirm.dto';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenEntity } from 'src/entities/token.entity';
import ms from 'ms';
import { TeamUserEntity } from 'src/entities/teamUsers.entity';
import { JoinToTeam } from './dto/joinToTeam.dto';
import { ChangeTeamDto } from './dto/changeTeam.dto';
import { IModulesEntity, ModulesEntity } from 'src/entities/modules.entity';
import { UserModuleEntity } from 'src/entities/userModules.entity';

@Injectable()
export class AuthService {
  private defaultRole: RolesEntity;
  private readonly encryptUtil: EncryptUtil = new EncryptUtil();
  private readonly OtpUtil: OtpUtil = new OtpUtil();
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<UserEntity>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: Repository<RolesEntity>,
    @Inject('OTP_REPOSITORY')
    private readonly otpRepository: Repository<OtpEntity>,
    @Inject('TEAM_REPOSITORY')
    private readonly teamRepository: Repository<TeamEntity>,
    @Inject('TOKEN_REPOSITORY')
    private readonly tokenRepository: Repository<TokenEntity>,
    @Inject('USER_TEAM_REPOSITORY') private readonly teamUserRepository: Repository<TeamUserEntity>,
    @Inject('MODULE_REPOSITORY') private readonly moduleRepository: Repository<ModulesEntity>,
    @Inject('MODULE_USER_REPOSITORY') private readonly userModuleRepository: Repository<UserModuleEntity>,
  ) {
    this.getDefaultRole();
  }

  private async getDefaultRole(): Promise<RolesEntity | null> {
    if (!this.defaultRole) {
      const defaultRole = await this.roleRepository.findOne({
        where: { isDefault: true,forUsers:true },
      });
      if (!defaultRole) {
        throw new Error('Default role not found');
      }
      this.defaultRole = defaultRole;
    }
    return this.defaultRole;
  }

  async register(dto: RegisterAuthDto) {
    if (dto.teamUrl) {
      const url = await this.teamRepository.findOne({
        where: { teamUrl: dto.teamUrl },
      });
      if (!url) {
        throw new HttpException('Team not found', 404);
      }
    }
    if (await this.userRepository.findOne({ where: { email: dto.email } }))
      throw new BadRequestException();
    dto.password = await this.encryptUtil.hashPassword(dto.password);
    const user = this.userRepository.create(dto);
    user.role = this.defaultRole;
    const userCreated = await this.userRepository.save(user);
    const otp = await this.otpRepository.save({
      code: await this.OtpUtil.Generate('numeric'),
      user: userCreated,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // DEVICE CONFIGURATION

    const link =
      this.configService.get<string>('BACK_URL') +
      '/auth/confirm/' +
      otp.code +
      '/' +
      +userCreated.id +
      '?callback?' +
      this.configService.get<string>('FRONT_URL') +
      '&confirmed=true';

    // SENDEMAIL
    return { message: 'User registered successfully' };
  }

  async confirm(params: ConfirmParamsDto, callback?: string) {
    const otpFind = await this.otpRepository.findOne({
      where: {
        code: params.otp,
        id: params.id,
        expiresAt: MoreThan(new Date()),
        used: false,
      },
    });
    if (!otpFind) {
      throw new BadRequestException('Invalid OTP or expired');
    }
    if (otpFind.userId !== Number(params.id)) {
      throw new BadRequestException('Invalid OTP or expired');
    }
    const user = await this.userRepository.findOne({
      where: { id: params.id },
    });
    if (!user) {
      throw new BadRequestException('Invalid OTP or expired');
    }
    user.isActive = true;
    await this.userRepository.save(user);
    this.otpRepository.update(otpFind.id, { used: true });
    return {
      message: 'User confirmed successfully',
      // link: callback + '?confirmed=true',
    };
  }

  async recover(otp: string, email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user) {
      throw new BadRequestException('Invalid OTP or expired');
    }
    if (!otp) {
      // EMAIL
      user.IsBloqued = true;
      await this.userRepository.save(user);
      const newOtp = await this.OtpUtil.Generate('numeric');
      await this.otpRepository.save({
        code: newOtp,
        user: user,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      return { message: 'User sendend to recover', otp: newOtp };
    }
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    const otpFind = await this.otpRepository.findOne({
      where: {
        code: otp,
        userId: user.id,
        expiresAt: MoreThan(new Date()),
        used: false,
      },
    });
    if (!otpFind) {
      throw new BadRequestException('Invalid OTP or expired');
    }
    otpFind.used = true;
    user.IsBloqued = false;
    user.password = await this.encryptUtil.hashPassword(password);
    this.otpRepository.save(otpFind);
    this.userRepository.save(user);

    return { message: 'recoverded user succefull' };
  }

  async login(user: UserEntity) {
    const role = this.roleRepository.findOne({where:{id: user.roleId},select: {name:true,id:true}});
    const payload = { sub: user.id, email: user.email, role: role };
    const tokenExist = await this.tokenRepository.findOne({ where: { user: user } });
    const time = ms(this.configService.get<string>('JWT_EXPIRATION'));
    const access_token = await this.jwtService.signAsync(payload);
    // this.tokenRepository.save({
    //   expirate: new Date(Date.now() + time),
    //   user: user,
    //   token: access_token,
    //   status: true
    // });
    await this.tokenRepository.upsert({
    userId: user.id,
    token: access_token,
    expirate: new Date(Date.now() + time),
    status: true,
  }, ['userId']);
    return { message: "Login successful", access_token }
  }
  public async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email: email }
    });

    if (!user) {
      return null;
    }
    if (!(await this.encryptUtil.comparePasswords(password, user.password))) {
      return null;
    }
    return user;
  }
  public async validateToken(token: string,iduser:number) {
    const tokenFind = await this.tokenRepository.findOne({
      where: { token: token, status: true,userId:iduser },
    });
    if (!tokenFind) {
      return null;
    }
    return await this.userRepository.findOne({where: { id: iduser }});
  }
  // public async validateToken(token) {
  public async me(user: UserEntity) {
    // extend for premium modules
    const modules: any[] = [];
    const modulesQuery = await this.moduleRepository.find({where: {forUsers:true,isPrivate:false,isPremium:false},select: {name:true,}});

    modulesQuery.forEach(element => {
      modules.push(element.name);
    });
    return {user,modules};
  }
    public async Modules() {
    // extend for premium modules
    const modules: any[] = [];
    const modulesQuery = await this.moduleRepository.find({where: {forUsers:true,isPrivate:false,isPremium:false},select: {name:true,id:true}});

    modulesQuery.forEach(element => {
      modules.push(element.name);
    });
    return modules;
  }
  
  public async myModules(user: UserEntity) {
    // extend for premium modules
    const modules: String[] = [];
    const moduleQuery = await this.userModuleRepository.find({where: {userId: user.id},relations:{module:true}});
    moduleQuery.forEach(element => {
      modules.push(element.module.name);
    });
    return modules;
  }
  async roleChange(currentUser: UserEntity, roleId: number) {
  // 1. Buscar el nuevo rol
  const newRole = await this.roleRepository.findOne({
    where: { id: roleId }
  });

  if (!newRole) {
   throw new BadRequestException('Role not found');
  }

   // 2. Actualizar el rol del usuario actual
  currentUser.role = newRole;
  await this.userRepository.save(currentUser);

  return { 
    message: 'Role successfully updated',
    newRole: newRole.name
  };
  }


  async getMyTeams(user: UserEntity) {
    const teamUsers =  await this.teamUserRepository.find({where:{userId:user.id,isActive:true},relations:{team:true}});
    console.log(teamUsers);
    if (teamUsers.length === 0) {
      throw new BadRequestException('No teams active');
    }
    return {
    message: 'Get my teams succefully',
    teams: teamUsers.map(tu => tu.team)
    };
  }

  async JoinToTeam(dto: JoinToTeam,user:UserEntity) {
    const teamSearch = await this.teamRepository.findOne({where:{inviteLink:dto.uuid,status:true}});
    if (!teamSearch) throw new BadRequestException();
    if (dto.isPrincipal) this.teamUserRepository.update({userId:user.id},{isPrincipal:true});
    // modificar roles  
    await this.teamUserRepository.save({teamId:teamSearch.id,userId: user.id,roleId:1,isActive:true,isPrincipal:true});

    return { 
      message: 'User added succefully',
      team: teamSearch
    };
  }

async ChangeTeam(dto: ChangeTeamDto,user:UserEntity) {
    
    const teamSearch = await this.teamRepository.findOne({where:{inviteLink:dto.uuid,status:true}});
    if (!teamSearch) throw new BadRequestException();
    
    const member = await this.teamUserRepository.findOne({where: {userId:user.id,teamId: teamSearch.id,isActive:true}})
    if (!member) throw new BadRequestException();
    if (member && member.isPrincipal) throw new BadRequestException();
    
    await this.teamUserRepository.update({userId:user.id,isPrincipal:true,isActive:true},{isPrincipal:false});
    member.isPrincipal =  true;
    await this.teamUserRepository.save(member);
    return { 
      message: 'User updated succefully',
      team: teamSearch
    };
  }

}
