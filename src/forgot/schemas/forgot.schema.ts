import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ForgotDocument = HydratedDocument<Forgot>;

@Schema({ collection: "forgot", timestamps: true, versionKey: false })
export class Forgot {
  @Prop({ type: Types.ObjectId, required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  token: string;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt?: Date;
}

export const ForgotSchema = SchemaFactory.createForClass(Forgot);
