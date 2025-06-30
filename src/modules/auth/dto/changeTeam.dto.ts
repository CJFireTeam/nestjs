import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID, MaxLength, MinLength } from "class-validator";

export class ChangeTeamDto {
    @IsUUID()
    uuid: string;
}