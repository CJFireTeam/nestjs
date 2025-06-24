import * as bcrypt from 'bcrypt';

export class EncryptUtil {
  private readonly SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
