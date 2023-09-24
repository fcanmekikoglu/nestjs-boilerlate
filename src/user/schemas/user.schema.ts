import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserRole } from "../user-role.enum";

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: "users", timestamps: true, versionKey: "_v" })
export class User {
  @Prop({ type: String, unique: true, required: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  password: string;

  @Prop({type: String, required:false})
  hash: string

  @Prop({ type: [String], enum: UserRole, default: [UserRole.USER] })
  roles: UserRole[];

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
