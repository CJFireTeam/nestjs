import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class RegisterAuthDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsUrl()
    teamUrl?: string;
}