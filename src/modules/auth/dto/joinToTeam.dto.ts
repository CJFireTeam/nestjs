import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID, MaxLength, MinLength } from "class-validator";

export class JoinToTeam {
    @IsUUID()
    uuid: string;

    @IsBoolean()
    isPrincipal: boolean;
}