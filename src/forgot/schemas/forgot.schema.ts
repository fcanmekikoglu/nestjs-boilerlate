import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ForgotDocument = HydratedDocument<Forgot>;

@Schema({ collection: "forgot", timestamps: true })
export class Forgot {
  @Prop({ type: Types.ObjectId, required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  token: string;
}

export const ForgotSchema = SchemaFactory.createForClass(Forgot);
