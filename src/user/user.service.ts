import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  public async findUserByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }

  // It's for auth service signup function. Do not use it on anywhere else
  public async createUser(email: string, hashedPassword: string): Promise<UserDocument> {
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });

    return await newUser.save();
  }
}
