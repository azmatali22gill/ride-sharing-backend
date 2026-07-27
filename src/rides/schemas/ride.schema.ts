import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { RideStatus, RideType } from "../../common/enums/ride.enum";

export type RideDocument = Ride & Document;

@Schema({ _id: false })
class RidePoint {
  @Prop({ required: true }) lat!: number;
  @Prop({ required: true }) lng!: number;
  @Prop() address?: string;
}
const RidePointSchema = SchemaFactory.createForClass(RidePoint);

@Schema({ _id: false })
class FareSnapshot {
  @Prop({ required: true }) baseFare!: number;
  @Prop({ required: true }) distanceCost!: number;
  @Prop({ required: true }) timeCost!: number;
  @Prop({ required: true, default: 1 }) surgeMultiplier!: number;
  @Prop({ required: true }) total!: number;
  @Prop({ default: "PKR" }) currency!: string;
}
const FareSnapshotSchema = SchemaFactory.createForClass(FareSnapshot);

@Schema({ timestamps: true })
export class Ride {
  @Prop({ type: Types.ObjectId, ref: "Passenger", required: true })
  passengerId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Driver", default: null })
  driverId!: Types.ObjectId | null;

  @Prop({ type: RidePointSchema, required: true })
  pickupLocation!: RidePoint;

  @Prop({ type: RidePointSchema, required: true })
  destination!: RidePoint;

  @Prop({ enum: RideType, required: true })
  rideType!: RideType;

  @Prop({ required: true })
  estimatedDistanceKm!: number;

  @Prop({ required: true })
  estimatedDurationMinutes!: number;

  @Prop({ type: FareSnapshotSchema, required: true })
  estimatedFare!: FareSnapshot;

  @Prop({ type: FareSnapshotSchema, default: null })
  actualFare!: FareSnapshot | null;

  @Prop({ enum: RideStatus, default: RideStatus.REQUESTED })
  status!: RideStatus;

  // Drivers who rejected or didn't respond in time — excluded from re-matching
  @Prop({ type: [Types.ObjectId], ref: "Driver", default: [] })
  rejectedDriverIds!: Types.ObjectId[];

  @Prop() requestExpiresAt!: Date;

  @Prop() acceptedAt?: Date;
  @Prop() arrivingAt?: Date;
  @Prop() startedAt?: Date;
  @Prop() completedAt?: Date;
  @Prop() cancelledAt?: Date;
  @Prop() cancellationReason?: string;
  @Prop() cancelledBy?: "PASSENGER" | "DRIVER" | "SYSTEM";
}

export const RideSchema = SchemaFactory.createForClass(Ride);
RideSchema.index({ passengerId: 1, createdAt: -1 });
RideSchema.index({ driverId: 1, createdAt: -1 });
RideSchema.index({ status: 1 });
