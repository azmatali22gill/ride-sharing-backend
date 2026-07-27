import { IsEnum, IsInt, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';
import { RaterType } from '../../common/enums/rating.enum';

export class CreateRatingDto {
  @IsMongoId() rideId: string;

  @IsEnum(RaterType) raterType: RaterType; // PASSENGER = rating a driver, DRIVER = rating a passenger

  @IsMongoId() fromUserId: string;
  @IsMongoId() toUserId: string;

  @IsInt() @Min(1) @Max(5) rating: number;

  @IsOptional() @IsString() review?: string;
}
