import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  /**
   * Fetches a user by their user ID from the database.
   *
   * @async
   * @param {string} userId - The ID of the user to retrieve.
   * @returns {Promise<UserDocument>} Returns a promise that resolves to the user document if found.
   * @throws {Error} Throws an error if there's an issue with the database operation.
   */
  public async getMe(userId: string): Promise<UserDocument> {
    return await this.userModel.findById(userId);
  }

  /**
   * Finds a user by their email address.
   *
   * @async
   * @public
   * @param {string} email - The email address of the user to be searched for.
   * @returns {Promise<UserDocument>} The user document if found, otherwise null.
   *
   * @example
   * const user = await usersService.findUserByEmail("example@example.com");
   * console.log(user);  // Logs the user document if found
   *
   * @memberof [UsersService]
   */
  public async findUserByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }

  /**
   * Creates a new user with the provided email and hashed password.
   * Intended exclusively for the auth service signup function. Should not be used elsewhere.
   *
   * @async
   * @public
   * @param {string} email - The email address of the new user.
   * @param {string} hashedPassword - The hashed password for the new user.
   * @returns {Promise<UserDocument>} The created user document.
   *
   * @example
   * const user = await usersService.createUser("example@example.com", "hashedPassword123");
   * console.log(user);  // Logs the newly created user document
   *
   * @memberof [UsersService]
   */ public async createUser(email: string, hashedPassword: string): Promise<UserDocument> {
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });

    return await newUser.save();
  }
}
