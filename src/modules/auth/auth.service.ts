import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Auth } from './entities/auth.entity';
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

@Injectable()

export class AuthService {
  private defaultRole: RolesEntity;
  private readonly encryptUtil: EncryptUtil = new EncryptUtil();
  private readonly OtpUtil: OtpUtil = new OtpUtil();
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('USER_REPOSITORY') private readonly userRepository: Repository<UserEntity>,
    @Inject('ROLE_REPOSITORY') private readonly roleRepository: Repository<RolesEntity>,
    @Inject('OTP_REPOSITORY')  private readonly otpRepository: Repository<OtpEntity>,
    @Inject('TEAM_REPOSITORY') private readonly teamRepository: Repository<TeamEntity>,

    
  ) {
    this.getDefaultRole();
  }

  private async getDefaultRole(): Promise<RolesEntity | null> {
    if (!this.defaultRole) {
      const defaultRole = await this.roleRepository.findOne({ where: { isDefault: true } });
      if (!defaultRole) {
        throw new Error('Default role not found');
      }
      this.defaultRole = defaultRole;
    }
    return this.defaultRole;
  }


  async register(dto: RegisterAuthDto) {
    if (dto.teamUrl) {
      const url = await this.teamRepository.findOne({ where: { teamUrl: dto.teamUrl } });
      if (!url) {
        throw new HttpException('Team not found', 404);
      }
    }
    if (await this.userRepository.findOne({ where: { email: dto.email } })) throw new BadRequestException();
    dto.password = await this.encryptUtil.hashPassword(dto.password);
    const user = this.userRepository.create(dto);
    user.role = this.defaultRole;
    const userCreated = await this.userRepository.save(user);
    const otp = await this.otpRepository.save({
      code: await this.OtpUtil.Generate('numeric'),
      user: userCreated,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // DEVICE CONFIGURATION


    const link = this.configService.get<string>('BACK_URL') + '/auth/confirm/' + otp.code + '/' + + userCreated.id + '/' + this.configService.get<string>('FRONT_URL') + '?confirmed=true';

    // SENDEMAIL
    return {message: 'User registered successfully',link: link };
  }


  async confirm(params :ConfirmParamsDto,callback?: string) {
    const otpFind = await this.otpRepository.findOne({
      where: {
        code: params.otp,
        id: params.id,
        expiresAt: MoreThan(new Date()),
        used: false,
      }
    })
    if (!otpFind) {
      throw new BadRequestException('Invalid OTP or expired');
    }
    if (otpFind.userId !== Number(params.id)) {
      throw new BadRequestException('Invalid OTP or expired');
    }
    const user = await this.userRepository.findOne({ where: { id:  params.id} });
    if (!user) {
      throw new BadRequestException('Invalid OTP or expired');
    }
    user.isActive = true;
    await this.userRepository.save(user);
    this.otpRepository.update(otpFind.id, { used: true });
    return {message: 'User confirmed successfully', link: callback + '?confirmed=true'};
  }

  async recover(otp:string,email: string,password:string) {
    const user = await this.userRepository.findOne({ where: { email:  email} });

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
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      })

      return {message: 'User sendend to recover', otp: newOtp};
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
      }
    })
    if (!otpFind) {
      throw new BadRequestException('Invalid OTP or expired');
    }
    otpFind.used = true;
    user.IsBloqued = false;
    user.password = await this.encryptUtil.hashPassword(password);
    this.otpRepository.save(otpFind)
    this.userRepository.save(user);

    return {message: 'recoverded user succefull'};
  }

  async login(dto: LoginAuthDto) {
    const user = await this.userRepository.findOne({ where: { email:  dto.email} });
    if (!user) {
      throw new BadRequestException();
    }
    if (!await this.encryptUtil.comparePasswords(dto.password,user.password)) {
      throw new BadRequestException();
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    }
    const jwt = await this.jwtService.signAsync(payload);
    return {accessToken: jwt,user: user};
    // GENERAMOS JWT
    // GUARDAMOS NUEVO DEVICE
    // RETORNAMOS JWT Y DATA BASE DE USER
  }
}
