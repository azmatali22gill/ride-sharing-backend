import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Passenger, PassengerDocument } from './schemas/passenger.schema';
import { CreatePassengerDto } from './dto/passenger.dto';

@Injectable()
export class PassengersService {
  constructor(@InjectModel(Passenger.name) private passengerModel: Model<PassengerDocument>) {}

  async register(dto: CreatePassengerDto): Promise<PassengerDocument> {
    const existing = await this.passengerModel.findOne({
      $or: [{ email: dto.email }, { phone: dto.phone }],
    });
    if (existing) throw new ConflictException('Passenger already registered');
    return this.passengerModel.create(dto);
  }

  async findById(id: string): Promise<PassengerDocument> {
    const passenger = await this.passengerModel.findById(id);
    if (!passenger) throw new NotFoundException('Passenger not found');
    return passenger;
  }

  async recordCompletedRide(passengerId: string, fare: number) {
    return this.passengerModel.findByIdAndUpdate(passengerId, {
      $inc: { totalRidesTaken: 1, totalSpent: fare },
    });
  }

  async applyRating(passengerId: string, rating: number) {
    const passenger = await this.findById(passengerId);
    const newCount = passenger.ratingCount + 1;
    const newAvg = (passenger.ratingAverage * passenger.ratingCount + rating) / newCount;
    passenger.ratingAverage = Math.round(newAvg * 100) / 100;
    passenger.ratingCount = newCount;
    return passenger.save();
  }
}
