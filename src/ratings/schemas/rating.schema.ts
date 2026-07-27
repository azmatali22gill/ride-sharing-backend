import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RaterType } from '../../common/enums/rating.enum';

export type RatingDocument = Rating & Document;

@Schema({ timestamps: true })
export class Rating {
  @Prop({ type: Types.ObjectId, ref: 'Ride', required: true })
  rideId: Types.ObjectId;

  @Prop({ enum: RaterType, required: true })
  raterType: RaterType; // who is giving the rating

  @Prop({ type: Types.ObjectId, required: true })
  fromUserId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  toUserId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop() review?: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
// A given rater can only rate a given ride once per direction
RatingSchema.index({ rideId: 1, raterType: 1 }, { unique: true });
