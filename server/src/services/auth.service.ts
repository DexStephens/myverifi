import { AuthUtils } from "../utils/auth.utils";
import { AuthResponse as BaseAuthResponse } from "../types";
import { UserModel } from "../models/user.model";
import { IssuerModel } from "../models/issuer.model";
import { HolderModel } from "../models/holder.model";
import { ControllerError } from "../utils/error.util";
import { ERROR_TITLES } from "../config/constants.config";
import { ChainUtils } from "../utils/chain.util";
import { Address } from "viem";
import { credentialQueue } from "./credentialQueue.service";
import { QueuedCredentialType } from "./credentialQueue.service";
import { CredentialType } from "@prisma/client";

interface AuthResponse extends BaseAuthResponse {
  issuer?: {
    name: string;
    contract_address: Address;
    credential_types: CredentialType[];
    pending_credential_types?: QueuedCredentialType[];
    apiKey?: string;
  };
}
export class AuthService {
  static async loginUser(
    email: string,
    password: string
  ): Promise<AuthResponse | null> {
    const existingUser = await UserModel.findUserByEmail(email);
    if (!existingUser) {
      throw new ControllerError(
        ERROR_TITLES.DNE,
        `No user found for the email: ${email}`
      );
    }

    const { password_hash, ...user } = existingUser;

    const isPasswordValid = await AuthUtils.verifyPassword(
      password,
      password_hash
    );

    if (!isPasswordValid) {
      return null;
    }

    const token = AuthUtils.getJwt(user);

    return {
      id: user.id,
      email: user.email,
      wallet: user.wallet,
      holder: user.holder
        ? {
            credential_issues: user.holder?.credential_issues ?? [],
          }
        : undefined,
      issuer: user.issuer
        ? {
            name: user.issuer?.name,
            contract_address: user.issuer?.contract_address as Address,
            credential_types: user.issuer?.credential_types ?? [],
            apiKey: user.issuer?.apiKey,
          }
        : undefined,
      token,
    };
  }

  static async registerUser(
    email: string,
    password: string,
    name?: string
  ): Promise<AuthResponse> {
    const user = await UserModel.findUserByEmail(email);
    if (user) {
      throw new ControllerError(ERROR_TITLES.UNIQUE, "Email is already in use");
    }

    const hashedPassword = await AuthUtils.hashPassword(password);

    const wallet = await ChainUtils.createWalletAccount();

    const newUser = await UserModel.createUser({
      email,
      password_hash: hashedPassword,
      walletId: wallet.id,
    });

    let newIssuer;
    let newHolder;

    if (name) {
      const contract_address = await ChainUtils.createCredentialFactory(
        wallet.privateKey as Address,
        name
      );

      newIssuer = await IssuerModel.createIssuer({
        userId: newUser.id,
        contract_address,
        name,
      });
    } else {
      newHolder = await HolderModel.createHolder({ userId: newUser.id });
    }

    const token = AuthUtils.getJwt(newUser);

    return {
      id: newUser.id,
      email,
      wallet,
      holder: newHolder
        ? {
            credential_issues: newHolder?.credential_issues ?? [],
          }
        : undefined,
      issuer: newIssuer
        ? {
            name: newIssuer?.name,
            contract_address: newIssuer?.contract_address,
            credential_types: newIssuer?.credential_types ?? [],
          }
        : undefined,
      token,
    };
  }

  static async getUser(token: string): Promise<AuthResponse | null> {
    try {
      if (!token) {
        throw new ControllerError(
          ERROR_TITLES.UNAUTHORIZED,
          "Token is required"
        );
      }

      const { email } = AuthUtils.validateJwt(token);
      const user = await UserModel.findUserByEmail(email);
      if (!user) {
        throw new ControllerError(ERROR_TITLES.DNE, "User not found");
      }

      const pendingCredTypes = credentialQueue.getPendingByEmail(user.email);

      return {
        id: user.id,
        email: user.email,
        wallet: user.wallet,
        holder: user.holder
          ? {
              credential_issues: user.holder?.credential_issues ?? [],
            }
          : undefined,
        issuer: user.issuer
          ? {
              name: user.issuer?.name,
              contract_address: user.issuer?.contract_address as Address,
              credential_types: user.issuer?.credential_types ?? [],
              pending_credential_types: pendingCredTypes,
              apiKey: user.issuer?.apiKey,
            }
          : undefined,
        token,
      };
    } catch (error) {
      throw new ControllerError(
        ERROR_TITLES.UNAUTHORIZED,
        "Invalid or expired token: "
      );
    }
  }

  static async getPendingUserCredentialTypes(email: string) {
    return credentialQueue.getPendingByEmail(email);
  }
}
