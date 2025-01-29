import { UserModel } from "../models/user.model";

export class AuthService {
  static async loginUser(email: string, password: string): Promise<boolean> {
    return false;
  }

  static async registerUser(email: string): Promise<boolean> {
    const user = await UserModel.findUserByEmail(email);
    console.log("User", user);
    if (user) {
      return false;
    }

    await UserModel.createUser({ email });
    return true;
  }
}
