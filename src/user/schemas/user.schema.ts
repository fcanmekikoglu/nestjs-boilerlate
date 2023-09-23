import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: "users", timestamps: true, versionKey: "_v" })
export class User {
  @Prop({ type: String, unique: true, trim: true })
  email: string;

  @Prop({ type: String, trim: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
