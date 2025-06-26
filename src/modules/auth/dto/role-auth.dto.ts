import { IsNotEmpty, IsNumber } from 'class-validator';

export class RoleAuthDto {
  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}
