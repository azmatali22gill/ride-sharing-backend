import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PassengerDocument = Passenger & Document;

@Schema({ timestamps: true })
export class Passenger {
  @Prop({ required: true, trim: true }) name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, unique: true, trim: true }) phone!: string;

  @Prop({ default: 0 }) ratingAverage!: number;
  @Prop({ default: 0 }) ratingCount!: number;

  @Prop({ default: 0 }) totalRidesTaken!: number;
  @Prop({ default: 0 }) totalSpent!: number;
}

export const PassengerSchema = SchemaFactory.createForClass(Passenger);
