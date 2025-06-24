import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto {
    @IsEmail()
    email: string;

    @IsString()
    @MaxLength(12)
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}