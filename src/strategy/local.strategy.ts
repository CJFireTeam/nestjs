import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginAuthDto } from 'src/modules/auth/dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // Use 'email' as the username field
  }
  
  async validate(email,password): Promise<any> {
    const dto = new LoginAuthDto();
    dto.email = email;
    dto.password = password;
    // Validate user credentials using AuthService
    if (!dto.email || !dto.password) {
      throw new UnauthorizedException('Email and password are required');
    }
    
    const user = await this.authService.validateUser(dto.email,dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}