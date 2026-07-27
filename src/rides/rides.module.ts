import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride, RideSchema } from './schemas/ride.schema';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';
import { MatchingService } from './matching.service';
import { FareModule } from '../fare/fare.module';
import { DriversModule } from '../drivers/drivers.module';
import { PassengersModule } from '../passengers/passengers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]),
    FareModule,
    DriversModule,
    PassengersModule,
  ],
  controllers: [RidesController],
  providers: [RidesService, MatchingService],
  exports: [RidesService, MatchingService],
})
export class RidesModule {}
