import { Injectable } from "@nestjs/common";
import { RideType } from "../common/enums/ride.enum";

export interface FareBreakdown {
  baseFare: number;
  distanceCost: number;
  timeCost: number;
  surgeMultiplier: number;
  subtotal: number;
  total: number;
  currency: string;
}

const RIDE_TYPE_CONFIG: Record<
  RideType,
  { base: number; perKm: number; perMin: number; multiplier: number }
> = {
  [RideType.ECONOMY]: { base: 80, perKm: 25, perMin: 3, multiplier: 1.0 },
  [RideType.COMFORT]: { base: 120, perKm: 32, perMin: 4, multiplier: 1.2 },
  [RideType.PREMIUM]: { base: 180, perKm: 45, perMin: 6, multiplier: 1.5 },
  [RideType.XL]: { base: 150, perKm: 38, perMin: 5, multiplier: 1.35 },
};

const MINIMUM_FARE = 100;

@Injectable()
export class FareService {
  estimateFare(
    distanceKm: number,
    durationMinutes: number,
    rideType: RideType,
    surgeMultiplier = 1,
  ): FareBreakdown {
    const config = RIDE_TYPE_CONFIG[rideType];

    const baseFare = config.base;
    const distanceCost = Math.round(distanceKm * config.perKm);
    const timeCost = Math.round(durationMinutes * config.perMin);

    const subtotal = (baseFare + distanceCost + timeCost) * config.multiplier;
    const total = Math.max(
      Math.round(subtotal * surgeMultiplier),
      MINIMUM_FARE,
    );

    return {
      baseFare,
      distanceCost,
      timeCost,
      surgeMultiplier,
      subtotal: Math.round(subtotal),
      total,
      currency: "PKR",
    };
  }

  calculateSurgeMultiplier(
    pendingRequests: number,
    availableDrivers: number,
  ): number {
    if (availableDrivers <= 0) return 3;
    const ratio = pendingRequests / availableDrivers;
    if (ratio <= 1) return 1;
    if (ratio <= 2) return 1.3;
    if (ratio <= 3) return 1.6;
    if (ratio <= 5) return 2.2;
    return 3;
  }
}
