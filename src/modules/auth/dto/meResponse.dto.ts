import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsUrl, MaxLength, MinLength } from 'class-validator';
import { responseStandart } from 'src/config/responseStandart';

export class meResponseDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
  
  @Expose()
  email: string;
  
}
export class meRespondeRole extends meResponseDto {
  @Expose()
  role: string;
}