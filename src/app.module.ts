import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

import { DriversModule } from './drivers/drivers.module';
import { PassengersModule } from './passengers/passengers.module';
import { RidesModule } from './rides/rides.module';
import { FareModule } from './fare/fare.module';
import { LocationModule } from './location/location.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') ?? 'mongodb://localhost:27017/ride_sharing',
      }),
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),

    DriversModule,
    PassengersModule,
    FareModule,
    RidesModule,
    LocationModule,
    RatingsModule,
  ],
})
export class AppModule {}
