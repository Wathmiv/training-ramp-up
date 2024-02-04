import { AppDataSource } from "..";
import { User } from "../models/user";
import { sendEmail } from "../utility/sendMail";
import { hashPassword, checkPassword } from "../utility/passwordFunctions";

export class UserService {
  static async create(data: Partial<User>) {
    const repository = AppDataSource.getRepository(User);
    const token = await sendEmail(data.email, data.name);
    if (!token) {
      throw new Error("Error sending email");
    } else {
      const newUser = repository.create({
        ...data,
        passwordToken: token,
        passwordExpires: Date.now() + 3600000,
      });
      return await repository.save(newUser);
    }
  }

  static async findAll() {
    try {
      const repository = AppDataSource.getRepository(User);
      return await repository.find();
    } catch (error) {
      console.error("Error finding all users:", error);
    }
  }

  static async addPassword(token: string, password: string) {
    try {
      const repository = AppDataSource.getRepository(User);
      const user = await repository.findOne({
        where: { passwordToken: token },
      });
      if (!user) {
        throw new Error("Invalid token");
      }
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
      user.passwordToken = null;
      user.passwordExpires = null;
      return await repository.save(user);
    } catch (error) {
      console.error("Error adding password:", error);
    }
  }

  static async login(email: string, password: string) {
    try {
      const repository = AppDataSource.getRepository(User);
      const user = await repository.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }
      const result = await checkPassword(user.password, password);
      if (!result) {
        throw new Error("Invalid password");
      }
      console.log(`User logged in ${user.email}`);
      return user;
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }
}
