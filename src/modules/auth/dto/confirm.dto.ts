import { IsNumberString, IsUrl, Matches } from "class-validator";

export class ConfirmParamsDto {
  @Matches(/^\d{4}$/, { message: 'OTP NO VALIDO' })
  otp: string;

  @IsNumberString({}, { message: 'ID debe ser un número' })
  id: number;
}