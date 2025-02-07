import { HolderUserModel } from "../models/holderUser.model";
import { WebUserModel } from "../models/webUser.model";
import { AuthUtils } from "../utils/auth.utils";
import { HolderUserLoginResponse, WebUserLoginResponse } from "../types";

export class AuthService {
  static async loginWebUser(
    email: string,
    password: string
  ): Promise<WebUserLoginResponse | null> {
    try {
      const { password_hash, ...user } = await WebUserModel.findUser(email);
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
            title: user.title,
            street_address: user.street_address,
            city: user.city,
            state: user.state,
            zip: user.zip,
            country: user.country,
            phone: user.phone,
          }
        : null;
    } catch (e) {
      console.error("Error logging in web user:", e);
      return null;
    }
  }

  static async registerWebUser(
    email: string,
    password: string,
    title: string,
    street_address: string,
    city: string,
    state: string,
    zip: string,
    country: string,
    phone: string
  ): Promise<WebUserLoginResponse | false> {
    try {
      const existingUser = await WebUserModel.findUser(email, title);
      if (existingUser) {
        return false;
      }

      const hashedPassword = await AuthUtils.hashPassword(password);

      await WebUserModel.createUser({
        email,
        password_hash: hashedPassword,
        title,
        street_address,
        city,
        state,
        zip,
        country,
        phone,
      });

      const user = await WebUserModel.findUser(email, title);

      return {
        email: user.email,
        title: user.title,
        street_address: user.street_address,
        city: user.city,
        state: user.state,
        zip: user.zip,
        country: user.country,
        phone: user.phone,
      };
    } catch (e) {
      console.error("Error registering web user:", e);
      return false;
    }
  }

  static async loginWalletUser(
    email: string,
    password: string
  ): Promise<HolderUserLoginResponse | null> {
    try {
      const { password_hash, ...user } = await HolderUserModel.findUserByEmail(
        email
      );
      if (!user) {
        return null;
      }

      const isPasswordValid = await AuthUtils.verifyPassword(
        password,
        password_hash
      );
      return isPasswordValid ? { email: user.email } : null;
    } catch (e) {
      console.error("Error logging in wallet user:", e);
      return null;
    }
  }

  static async registerWalletUser(
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const existingUser = await HolderUserModel.findUserByEmail(email);
      if (existingUser) {
        return false;
      }

      const hashedPassword = await AuthUtils.hashPassword(password);

      await HolderUserModel.createUser({
        email,
        password_hash: hashedPassword,
      });

      return true;
    } catch (e) {
      console.error("Error registering wallet user:", e);
      return false;
    }
  }
}
