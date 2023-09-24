import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Forgot, ForgotDocument } from "./schemas/forgot.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class ForgotService {
  constructor(@InjectModel(Forgot.name) private readonly forgotModel: Model<Forgot>) {}

  async create(userId: Types.ObjectId, token: string): Promise<ForgotDocument> {
    await this.forgotModel.deleteMany({ user: userId });

    return await this.forgotModel.create({ user: userId, token });
  }
}
