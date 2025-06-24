import * as bcrypt from 'bcrypt';
import { error } from 'console';

export class OtpUtil {
  private readonly MAX_LENGTH = 4;

  async Generate(Type:'numeric' | 'alphanumeric'): Promise<string> {
   if (Type === 'numeric') return await this.generateNumericOtp();
    if (Type === 'alphanumeric') return await this.generateAlphaNumericOtp(); 
    throw error('Invalid OTP type. Use "numeric" or "alphanumeric".');
  }

  private generateNumericOtp(): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < this.MAX_LENGTH; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

private generateAlphaNumericOtp(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let otp = '';
  for (let i = 0; i < this.MAX_LENGTH; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
}
}
