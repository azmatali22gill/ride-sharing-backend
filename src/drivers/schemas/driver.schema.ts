import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import {
  DriverStatus,
  VerificationStatus,
} from "../../common/enums/driver.enum";

export type DriverDocument = Driver & Document;

@Schema({ _id: false })
class Vehicle {
  @Prop({ required: true }) make!: string;
  @Prop({ required: true }) model!: string;
  @Prop({ required: true }) color!: string;
  @Prop({ required: true, unique: false }) plateNumber!: string;
  @Prop({ required: true, default: 4 }) capacity!: number;
  @Prop({ default: "ECONOMY" }) category!: string;
}
const VehicleSchema = SchemaFactory.createForClass(Vehicle);

@Schema({ _id: false })
class GeoLocation {
  @Prop({ type: String, enum: ["Point"], default: "Point" })
  type!: string;

  @Prop({ type: [Number], required: true }) // [lng, lat]
  coordinates!: number[];

  @Prop() updatedAt!: Date;
}
const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);

@Schema({ timestamps: true })
export class Driver {
  @Prop({ required: true, trim: true }) name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, unique: true, trim: true }) phone!: string;

  @Prop({ type: VehicleSchema, required: true }) vehicle!: Vehicle;

  @Prop({ enum: VerificationStatus, default: VerificationStatus.PENDING })
  verificationStatus!: VerificationStatus;

  @Prop({ enum: DriverStatus, default: DriverStatus.OFFLINE })
  status!: DriverStatus;

  @Prop({ type: GeoLocationSchema })
  currentLocation!: GeoLocation;

  // Denormalized rating aggregate for fast reads
  @Prop({ default: 0 }) ratingAverage!: number;
  @Prop({ default: 0 }) ratingCount!: number;

  @Prop({ default: 0 }) totalRidesCompleted!: number;
  @Prop({ default: 0 }) totalEarnings!: number;

  // Ride currently assigned to this driver (null when free)
  @Prop({ type: Types.ObjectId, ref: "Ride", default: null })
  activeRideId!: Types.ObjectId | null;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
DriverSchema.index({ currentLocation: "2dsphere" });
DriverSchema.index({ status: 1 });
