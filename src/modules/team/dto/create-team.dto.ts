import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsUrl, MaxLength, MinLength } from 'class-validator';
import { responseStandart } from 'src/config/responseStandart';

export class CreateTeamDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(1, { message: 'El nombre debe tener al menos 1 carácter' })
  @MaxLength(100, { message: 'El nombre debe tener máximo 100 caracteres' })
  name: string;

  @IsOptional()
  @IsUrl({}, { message: 'La URL del equipo debe ser válida' })
  teamUrl?: string;
}


export class CreateTeamResponseDto extends responseStandart {
  @Expose()
  name: string;
}