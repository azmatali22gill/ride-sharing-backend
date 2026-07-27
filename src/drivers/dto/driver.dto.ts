import { Type } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import {
  DriverStatus,
  VerificationStatus,
} from "../../common/enums/driver.enum";

export class VehicleDto {
  @IsString() @IsNotEmpty() make!: string;
  @IsString() @IsNotEmpty() model!: string;
  @IsString() @IsNotEmpty() color!: string;
  @IsString() @IsNotEmpty() plateNumber!: string;
  @IsInt() @Min(1) @Max(20) capacity!: number;
  @IsIn(["ECONOMY", "COMFORT", "PREMIUM", "XL"]) category!: string;
}

export class CreateDriverDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsEmail() email!: string;
  @IsString() @IsNotEmpty() phone!: string;
  @IsInt() @IsNotEmpty() age!: number;

  @IsString()
  @IsNotEmpty()
  gender!: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => VehicleDto)
  vehicle!: VehicleDto;
}

export class UpdateVerificationDto {
  @IsEnum(VerificationStatus) verificationStatus!: VerificationStatus;
}

export class UpdateDriverStatusDto {
  @IsEnum(DriverStatus) status!: DriverStatus;
}

export class UpdateLocationDto {
  @IsLatitude() lat!: number;
  @IsLongitude() lng!: number;
}

export class NearbyDriversQueryDto {
  @IsLatitude() @Type(() => Number) lat!: number;
  @IsLongitude() @Type(() => Number) lng!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  radiusKm?: number;
}
