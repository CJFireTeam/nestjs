import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class RegisterWhitOwner {
    @IsEmail()
    email: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsUrl()
    teamUrl?: string;

    @IsNumber()
    @IsNotEmpty()
    roleId:number;
}