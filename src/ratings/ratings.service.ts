import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating, RatingDocument } from './schemas/rating.schema';
import { CreateRatingDto } from './dto/rating.dto';
import { RaterType } from '../common/enums/rating.enum';
import { RidesService } from '../rides/rides.service';
import { DriversService } from '../drivers/drivers.service';
import { PassengersService } from '../passengers/passengers.service';
import { RideStatus } from '../common/enums/ride.enum';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
    private readonly ridesService: RidesService,
    private readonly driversService: DriversService,
    private readonly passengersService: PassengersService,
  ) {}

  async submitRating(dto: CreateRatingDto): Promise<RatingDocument> {
    const ride = await this.ridesService.getOrThrow(dto.rideId);

    if (ride.status !== RideStatus.COMPLETED) {
      throw new BadRequestException('Ratings can only be submitted for completed rides');
    }

    // Validate the rater/ratee actually belong to this ride, in the correct direction
    const passengerId = String(ride.passengerId);
    const driverId = String(ride.driverId);

    if (dto.raterType === RaterType.PASSENGER) {
      if (dto.fromUserId !== passengerId || dto.toUserId !== driverId) {
        throw new BadRequestException('Passenger rating must go from the ride passenger to the ride driver');
      }
    } else {
      if (dto.fromUserId !== driverId || dto.toUserId !== passengerId) {
        throw new BadRequestException('Driver rating must go from the ride driver to the ride passenger');
      }
    }

    const existing = await this.ratingModel.findOne({ rideId: dto.rideId, raterType: dto.raterType });
    if (existing) {
      throw new ConflictException('This ride has already been rated in this direction');
    }

    const rating = await this.ratingModel.create(dto);

    if (dto.raterType === RaterType.PASSENGER) {
      await this.driversService.applyRating(driverId, dto.rating);
    } else {
      await this.passengersService.applyRating(passengerId, dto.rating);
    }

    return rating;
  }

  async getForRide(rideId: string) {
    return this.ratingModel.find({ rideId });
  }

  async getForUser(userId: string) {
    return this.ratingModel.find({ toUserId: userId }).sort({ createdAt: -1 });
  }
}
