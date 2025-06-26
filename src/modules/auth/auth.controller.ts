import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe, Query, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ConfirmParamsDto } from './dto/confirm.dto';
import { LoginAuthDto } from './dto/login.dto';
import { LocalGuard } from 'src/guard/local/local.guard';
import { JwtGuard } from 'src/guard/jwt/jwt.guard';
import { RoleAuthDto } from './dto/role-auth.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register (@Body() dto: RegisterAuthDto) {
    return this.authService.register(dto);
  }


  @Get('confirm/:otp/:id')
  confirm(
    @Param(new ValidationPipe({ transform: true, whitelist: true })) params: ConfirmParamsDto,
    @Query('callback') callback: string) {
    return this.authService.confirm(params,callback);
  }

  @Get('recover')
  recover(
    @Query('otp') otp: string,
    @Query('email') email: string,
    @Query('password') password:string,
  ) {
    return this.authService.recover(otp,email,password);
  }
  @UseGuards(LocalGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Get('me')
  @UseGuards(JwtGuard)
  me(@Request() req) {
    return this.authService.me(req.user);
  }

  @UseGuards(JwtGuard) // JwtGuard para autorización con token
  @Post('role')
  roleChange(
    @Request() req,
    @Body() dto: RoleAuthDto
  ) {
    return this.authService.roleChange(req.user, dto.roleId);
  }

}
