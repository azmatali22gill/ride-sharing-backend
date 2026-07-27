import { Type } from "class-transformer";
import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { RideType } from "../../common/enums/ride.enum";

export class RidePointDto {
  @IsLatitude() lat!: number;
  @IsLongitude() lng!: number;
  @IsOptional() @IsString() address?: string;
}

export class RequestRideDto {
  @IsMongoId() passengerId!: string;

  @ValidateNested()
  @Type(() => RidePointDto)
  pickupLocation!: RidePointDto;

  @ValidateNested()
  @Type(() => RidePointDto)
  destination!: RidePointDto;

  @IsEnum(RideType) rideType!: RideType;
}

export class RespondToRideDto {
  @IsMongoId() driverId!: string;
}

export class CancelRideDto {
  @IsNotEmpty() @IsString() cancelledBy!: "PASSENGER" | "DRIVER" | "SYSTEM";
  @IsOptional() @IsString() reason?: string;
}
