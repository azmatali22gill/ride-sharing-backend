import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/rating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  submit(@Body() dto: CreateRatingDto) {
    return this.ratingsService.submitRating(dto);
  }

  @Get('ride/:rideId')
  getForRide(@Param('rideId') rideId: string) {
    return this.ratingsService.getForRide(rideId);
  }

  @Get('user/:userId')
  getForUser(@Param('userId') userId: string) {
    return this.ratingsService.getForUser(userId);
  }
}
