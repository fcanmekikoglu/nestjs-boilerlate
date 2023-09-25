import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Forgot, ForgotDocument } from "./schemas/forgot.schema";
import { FilterQuery, Model, Types } from "mongoose";

@Injectable()
export class ForgotService {
  constructor(@InjectModel(Forgot.name) private readonly forgotModel: Model<Forgot>) {}

  async findOne(query: FilterQuery<ForgotDocument>): Promise<ForgotDocument> {
    return await this.forgotModel.findOne(query);
  }

  async findMany(query: FilterQuery<ForgotDocument>): Promise<ForgotDocument[]> {
    return await this.forgotModel.find(query);
  }

  async create(userId: Types.ObjectId, token: string): Promise<ForgotDocument> {
    await this.forgotModel.deleteMany({ user: userId });

    return await this.forgotModel.create({ user: userId, token });
  }

  async findByUser(userId: Types.ObjectId): Promise<ForgotDocument> {
    return await this.forgotModel.findOne({ user: userId });
  }
}
