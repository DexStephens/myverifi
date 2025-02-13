import { AuthUtils } from "../utils/auth.utils";
import { AuthResponse, NewIssuer } from "../types";
import { UserModel } from "../models/user.model";
import { IssuerModel } from "../models/issuer.model";
import { HolderModel } from "../models/holder.model";

export class AuthService {
  static async loginUser(
    email: string,
    password: string
  ): Promise<AuthResponse | null> {
    try {
      const { password_hash, ...user } = await UserModel.findUserByEmail(email);
      if (!user) {
        return null;
      }

      const isPasswordValid = await AuthUtils.verifyPassword(
        password,
        password_hash
      );

      return isPasswordValid
        ? {
            email: user.email,
            holder: user.holder
              ? {
                  credential_issues: user.holder?.credential_issues ?? [],
                }
              : undefined,
            issuer: user.issuer
              ? {
                  name: user.issuer?.name,
                  contract_address: user.issuer?.contract_address,
                  credential_types: user.issuer?.credential_types ?? [],
                }
              : undefined,
          }
        : null;
    } catch (e) {
      console.error("Error logging in web user:", e);
      return null;
    }
  }

  static async registerUser(
    email: string,
    password: string,
    address: string,
    issuer: NewIssuer
  ): Promise<AuthResponse | null> {
    try {
      const user = await UserModel.findUserByEmail(email);
      if (user) {
        return null;
      }

      const hashedPassword = await AuthUtils.hashPassword(password);

      const newUser = await UserModel.createUser({
        email,
        password_hash: hashedPassword,
        address,
      });

      let newIssuer;
      let newHolder;

      if (issuer) {
        const { name, contract_address } = issuer;
        newIssuer = await IssuerModel.createIssuer({
          userId: newUser.id,
          contract_address,
          name,
        });
      } else {
        newHolder = await HolderModel.createHolder({ userId: newUser.id });
      }

      return {
        email,
        holder: newHolder,
        issuer: newIssuer,
      };
    } catch (e) {
      console.error("Error registering user:", e);
      return null;
    }
  }
}
