import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Ride, RideDocument } from './schemas/ride.schema';
import { RequestRideDto, CancelRideDto } from './dto/ride.dto';
import { RIDE_STATUS_TRANSITIONS, RideStatus } from '../common/enums/ride.enum';
import { FareService } from '../fare/fare.service';
import { DriversService } from '../drivers/drivers.service';
import { PassengersService } from '../passengers/passengers.service';
import { MatchingService } from './matching.service';
import { haversineDistanceKm, estimateDurationMinutes } from '../common/utils/geo.util';

@Injectable()
export class RidesService {
  private readonly logger = new Logger(RidesService.name);

  constructor(
    @InjectModel(Ride.name) private rideModel: Model<RideDocument>,
    private readonly fareService: FareService,
    private readonly driversService: DriversService,
    private readonly passengersService: PassengersService,
    private readonly matchingService: MatchingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ---------------------------------------------------------------------
  // 1. Ride request creation + first dispatch
  // ---------------------------------------------------------------------
  async requestRide(dto: RequestRideDto): Promise<RideDocument> {
    await this.passengersService.findById(dto.passengerId);

    const distanceKm = haversineDistanceKm(dto.pickupLocation, dto.destination);
    const durationMinutes = estimateDurationMinutes(distanceKm);

    const candidates = await this.matchingService.findCandidates(
      dto.pickupLocation.lat,
      dto.pickupLocation.lng,
    );
    const surge = this.fareService.calculateSurgeMultiplier(
      await this.countActiveRequests(),
      candidates.length,
    );
    const estimatedFare = this.fareService.estimateFare(distanceKm, durationMinutes, dto.rideType, surge);

    const ride = await this.rideModel.create({
      passengerId: dto.passengerId,
      pickupLocation: dto.pickupLocation,
      destination: dto.destination,
      rideType: dto.rideType,
      estimatedDistanceKm: Math.round(distanceKm * 100) / 100,
      estimatedDurationMinutes: Math.round(durationMinutes),
      estimatedFare,
      status: RideStatus.REQUESTED,
      requestExpiresAt: new Date(Date.now() + this.matchingService.requestTimeoutSeconds * 1000),
    });

    await this.dispatchToNextCandidate(ride);
    return ride;
  }

  /** Picks the nearest not-yet-rejected candidate and pushes the request to them via WS. */
  private async dispatchToNextCandidate(ride: RideDocument) {
    const candidates = await this.matchingService.findCandidates(
      ride.pickupLocation.lat,
      ride.pickupLocation.lng,
      ride.rejectedDriverIds.map(String),
    );

    if (candidates.length === 0) {
      this.logger.warn(`No available drivers for ride ${ride._id}`);
      return;
    }

    const nearest = candidates[0];
    this.matchingService.dispatchToDriver(String(nearest._id), {
      rideId: String(ride._id),
      pickupLocation: ride.pickupLocation,
      destination: ride.destination,
      rideType: ride.rideType,
      estimatedFare: ride.estimatedFare.total,
      estimatedDistanceKm: ride.estimatedDistanceKm,
      expiresAt: ride.requestExpiresAt,
    });
  }

  // ---------------------------------------------------------------------
  // 2. Driver accept / reject
  // ---------------------------------------------------------------------
  async acceptRide(rideId: string, driverId: string): Promise<RideDocument> {
    const ride = await this.getOrThrow(rideId);

    if (ride.status !== RideStatus.REQUESTED) {
      throw new BadRequestException(`Ride is no longer requestable (status: ${ride.status})`);
    }
    if (ride.requestExpiresAt && ride.requestExpiresAt.getTime() < Date.now()) {
      await this.expireRide(ride);
      throw new BadRequestException('Ride request has expired');
    }

    // Business rule: a driver cannot accept multiple rides at once — this is
    // enforced atomically at the DB level (findOneAndUpdate only matches AVAILABLE).
    const assignedDriver = await this.matchingService.tryAssignDriver(driverId, ride._id);
    if (!assignedDriver) {
      throw new BadRequestException('Driver is not available (already on a ride or offline)');
    }

    ride.driverId = new Types.ObjectId(driverId);
    ride.status = RideStatus.ACCEPTED;
    ride.acceptedAt = new Date();
    await ride.save();

    this.eventEmitter.emit('ride.accepted', { rideId: String(ride._id), driverId, passengerId: String(ride.passengerId) });
    return ride;
  }

  async rejectRide(rideId: string, driverId: string): Promise<RideDocument> {
    const ride = await this.getOrThrow(rideId);
    if (ride.status !== RideStatus.REQUESTED) {
      throw new BadRequestException('Ride is no longer pending');
    }

    ride.rejectedDriverIds.push(new Types.ObjectId(driverId));
    await ride.save();

    // Immediately try the next-nearest driver so the passenger isn't left waiting.
    await this.dispatchToNextCandidate(ride);
    return ride;
  }

  // ---------------------------------------------------------------------
  // 3. Lifecycle transitions: ARRIVING -> STARTED -> COMPLETED, or CANCELLED
  // ---------------------------------------------------------------------
  async transition(rideId: string, driverId: string, next: RideStatus): Promise<RideDocument> {
    const ride = await this.getOrThrow(rideId);

    if (String(ride.driverId) !== driverId) {
      throw new ForbiddenException('Only the assigned driver can update this ride');
    }
    this.assertTransitionAllowed(ride.status, next);

    switch (next) {
      case RideStatus.ARRIVING:
        ride.arrivingAt = new Date();
        break;
      case RideStatus.STARTED:
        ride.startedAt = new Date();
        break;
      case RideStatus.COMPLETED:
        return this.completeRide(ride);
      default:
        break;
    }

    ride.status = next;
    await ride.save();
    this.eventEmitter.emit('ride.status_changed', { rideId: String(ride._id), status: next });
    return ride;
  }

  private async completeRide(ride: RideDocument): Promise<RideDocument> {
    ride.status = RideStatus.COMPLETED;
    ride.completedAt = new Date();
    // Recompute actual fare from estimate (a real system would use tracked GPS distance/time)
    ride.actualFare = ride.estimatedFare;
    await ride.save();

    await this.driversService.releaseFromRide(String(ride.driverId));
    await this.driversService.recordCompletedRide(String(ride.driverId), ride.actualFare.total);
    await this.passengersService.recordCompletedRide(String(ride.passengerId), ride.actualFare.total);

    this.eventEmitter.emit('ride.completed', { rideId: String(ride._id) });
    return ride;
  }

  async cancelRide(rideId: string, dto: CancelRideDto): Promise<RideDocument> {
    const ride = await this.getOrThrow(rideId);
    this.assertTransitionAllowed(ride.status, RideStatus.CANCELLED);

    ride.status = RideStatus.CANCELLED;
    ride.cancelledAt = new Date();
    ride.cancelledBy = dto.cancelledBy;
    ride.cancellationReason = dto.reason;
    await ride.save();

    if (ride.driverId) {
      await this.driversService.releaseFromRide(String(ride.driverId));
    }

    this.eventEmitter.emit('ride.cancelled', { rideId: String(ride._id), cancelledBy: dto.cancelledBy });
    return ride;
  }

  private assertTransitionAllowed(current: RideStatus, next: RideStatus) {
    const allowed = RIDE_STATUS_TRANSITIONS[current] ?? [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(`Cannot transition ride from ${current} to ${next}`);
    }
  }

  // ---------------------------------------------------------------------
  // 4. Expiry sweep — runs every 10s, expires stale REQUESTED rides
  // ---------------------------------------------------------------------
  @Cron(CronExpression.EVERY_10_SECONDS)
  async sweepExpiredRequests() {
    const stale = await this.rideModel.find({
      status: RideStatus.REQUESTED,
      requestExpiresAt: { $lt: new Date() },
    });
    for (const ride of stale) {
      await this.expireRide(ride);
    }
  }

  private async expireRide(ride: RideDocument) {
    ride.status = RideStatus.EXPIRED;
    await ride.save();
    this.eventEmitter.emit('ride.expired', { rideId: String(ride._id), passengerId: String(ride.passengerId) });
    this.logger.log(`Ride ${ride._id} expired (no driver accepted in time)`);
  }

  private async countActiveRequests(): Promise<number> {
    return this.rideModel.countDocuments({ status: RideStatus.REQUESTED });
  }

  // ---------------------------------------------------------------------
  // 5. Reads / history
  // ---------------------------------------------------------------------
  async getOrThrow(rideId: string): Promise<RideDocument> {
    const ride = await this.rideModel.findById(rideId);
    if (!ride) throw new NotFoundException('Ride not found');
    return ride;
  }

  async getPassengerHistory(passengerId: string) {
    const rides = await this.rideModel
      .find({ passengerId, status: { $in: [RideStatus.COMPLETED, RideStatus.CANCELLED] } })
      .sort({ createdAt: -1 });
    const totalSpending = rides
      .filter((r) => r.status === RideStatus.COMPLETED)
      .reduce((sum, r) => sum + (r.actualFare?.total ?? 0), 0);
    return { rides, totalSpending, totalRides: rides.length };
  }

  async getDriverHistory(driverId: string) {
    const rides = await this.rideModel
      .find({ driverId, status: { $in: [RideStatus.COMPLETED, RideStatus.CANCELLED] } })
      .sort({ createdAt: -1 });
    const totalEarnings = rides
      .filter((r) => r.status === RideStatus.COMPLETED)
      .reduce((sum, r) => sum + (r.actualFare?.total ?? 0), 0);
    return { rides, totalEarnings, completedRides: rides.filter((r) => r.status === RideStatus.COMPLETED).length };
  }
}
