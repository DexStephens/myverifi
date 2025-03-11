import { AuthUtils } from "../utils/auth.utils";
import { AuthResponse } from "../types";
import { UserModel } from "../models/user.model";
import { IssuerModel } from "../models/issuer.model";
import { HolderModel } from "../models/holder.model";
import { ControllerError } from "../utils/error.util";
import { ERROR_TITLES } from "../config/constants.config";
import * as jwt from "jsonwebtoken";
import { ChainUtils } from "../utils/chain.util";
import { Address } from "viem";

// Define a secret key (store this in an environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET; // Replace with a strong secret in production

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

    // Create JWT payload
    const payload = {
      id: user.id,
      email: user.email,
      wallet: user.wallet,
      // Add more fields if needed, but avoid sensitive data
    };

    // Generate JWT (expires in 1 hour)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return {
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
            contract_address: user.issuer?.contract_address,
            credential_types: user.issuer?.credential_types ?? [],
          }
        : undefined,
      token, // Return the real JWT
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

    // Create JWT payload
    const payload = {
      id: newUser.id,
      email: newUser.email,
      // Add more fields if needed
    };

    // Generate JWT (expires in 1 hour)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return {
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
      token, // Return the real JWT
    };
  }

  static async getUser(token: string): Promise<AuthResponse | null> {
    try {
      if (!token) {
        throw new ControllerError(ERROR_TITLES.UNAUTHORIZED, "Token is required");
      }
  
      // Verify and decode JWT
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
  
      // Find user in the database
      const user = await UserModel.findUserByEmail(decoded.email);
      if (!user) {
        throw new ControllerError(ERROR_TITLES.DNE, "User not found");
      }
  
      return {
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
              contract_address: user.issuer?.contract_address,
              credential_types: user.issuer?.credential_types ?? [],
            }
          : undefined,
        token, // Optional: You might not need to return the token again
      };
    } catch (error) {
      console.error("Error in getUser:", error);
      return null;
    }
  }
}
