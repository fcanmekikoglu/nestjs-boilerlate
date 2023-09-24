import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  public async getMe(userId: string): Promise<UserDocument> {
    return await this.userModel.findById(userId);
  }

  public async findUserByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }

  public async createUser(email: string, hashedPassword: string): Promise<UserDocument> {
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });

    return await newUser.save();
  }
}
