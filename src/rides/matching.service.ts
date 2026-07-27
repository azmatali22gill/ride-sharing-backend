import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DriversService } from '../drivers/drivers.service';
import { DriverDocument } from '../drivers/schemas/driver.schema';

/**
 * Encapsulates the "driver matching" business rules described in the spec:
 *  1. Find nearby available drivers
 *  2. Send ride request (dispatch)
 *  3. Driver accepts/rejects
 *  4. Assign driver to passenger
 *
 * Kept separate from RidesService so the matching algorithm (currently
 * nearest-first geo search) can evolve independently of ride lifecycle logic.
 */
@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);
  private readonly defaultRadiusKm: number;
  readonly requestTimeoutSeconds: number;

  constructor(
    private readonly driversService: DriversService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.defaultRadiusKm = Number(this.configService.get('DRIVER_SEARCH_RADIUS_KM') ?? 5);
    this.requestTimeoutSeconds = Number(this.configService.get('RIDE_REQUEST_TIMEOUT_SECONDS') ?? 30);
  }

  /** Finds nearby AVAILABLE, VERIFIED drivers, excluding any already rejected for this ride. */
  async findCandidates(
    lat: number,
    lng: number,
    excludeDriverIds: string[] = [],
    radiusKm?: number,
  ): Promise<DriverDocument[]> {
    const drivers = await this.driversService.findNearbyAvailable(
      lat,
      lng,
      radiusKm ?? this.defaultRadiusKm,
    );
    const excluded = new Set(excludeDriverIds.map(String));
    return drivers.filter((d) => !excluded.has(String(d._id)));
  }

  /** Dispatches the ride request to a driver by emitting an event the WS gateway listens on. */
  dispatchToDriver(driverId: string, ridePayload: Record<string, unknown>) {
    this.logger.log(`Dispatching ride ${ridePayload.rideId} to driver ${driverId}`);
    this.eventEmitter.emit('ride.dispatch', { driverId, ride: ridePayload });
  }

  /** Atomically attempts to lock a driver onto a ride. Returns null if driver was taken already. */
  async tryAssignDriver(driverId: string, rideId: any) {
    return this.driversService.assignToRide(driverId, rideId);
  }
}
