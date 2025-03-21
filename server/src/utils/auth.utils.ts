import * as bcrypt from "bcrypt";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "../config";

export class AuthUtils {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static getTokenFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    return authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  }

  static getJwt(user: any): string {
    const payload = {
      id: user.id,
      email: user.email,
      wallet: user.wallet,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.TOKEN_EXPIRATION });
    return token;
  }

  static validateJwt(token: string): any {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; email: string };
    return decoded;
  }
}
