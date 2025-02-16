import { AuthUtils } from "../utils/auth.utils";
import { AuthResponse, NewIssuer } from "../types";
import { UserModel } from "../models/user.model";
import { IssuerModel } from "../models/issuer.model";
import { HolderModel } from "../models/holder.model";
import { ControllerError } from "../utils/error.util";
import { ERROR_TITLES } from "../config/constants.config";

export class AuthService {
  static async loginUser(
    email: string,
    password: string
  ): Promise<AuthResponse | null> {
    const { password_hash, ...user } = await UserModel.findUserByEmail(email);
    if (!user) {
      throw new ControllerError(
        ERROR_TITLES.DNE,
        `No user found for the email: ${email}`
      );
    }

    const isPasswordValid = await AuthUtils.verifyPassword(
      password,
      password_hash
    );

    return isPasswordValid
      ? {
          email: user.email,
          address: user.address,
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
  }

  static async registerUser(
    email: string,
    password: string,
    issuer: NewIssuer
  ): Promise<AuthResponse> {
    const user = await UserModel.findUserByEmail(email);
    if (user) {
      throw new ControllerError(ERROR_TITLES.UNIQUE, "Email is already in use");
    }

    const hashedPassword = await AuthUtils.hashPassword(password);

    const newUser = await UserModel.createUser({
      email,
      password_hash: hashedPassword,
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
  }
}
