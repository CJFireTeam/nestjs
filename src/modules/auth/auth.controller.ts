import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ValidationPipe, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ConfirmParamsDto } from './dto/confirm.dto';
import { LoginAuthDto } from './dto/login.dto';

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

  @Post('login')
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto)
  }

}
