"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RidesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const ride_schema_1 = require("./schemas/ride.schema");
const ride_enum_1 = require("../common/enums/ride.enum");
const fare_service_1 = require("../fare/fare.service");
const drivers_service_1 = require("../drivers/drivers.service");
const passengers_service_1 = require("../passengers/passengers.service");
const matching_service_1 = require("./matching.service");
const geo_util_1 = require("../common/utils/geo.util");
let RidesService = RidesService_1 = class RidesService {
    constructor(rideModel, fareService, driversService, passengersService, matchingService, eventEmitter) {
        this.rideModel = rideModel;
        this.fareService = fareService;
        this.driversService = driversService;
        this.passengersService = passengersService;
        this.matchingService = matchingService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(RidesService_1.name);
    }
    async requestRide(dto) {
        await this.passengersService.findById(dto.passengerId);
        const distanceKm = (0, geo_util_1.haversineDistanceKm)(dto.pickupLocation, dto.destination);
        const durationMinutes = (0, geo_util_1.estimateDurationMinutes)(distanceKm);
        const candidates = await this.matchingService.findCandidates(dto.pickupLocation.lat, dto.pickupLocation.lng);
        const surge = this.fareService.calculateSurgeMultiplier(await this.countActiveRequests(), candidates.length);
        const estimatedFare = this.fareService.estimateFare(distanceKm, durationMinutes, dto.rideType, surge);
        const ride = await this.rideModel.create({
            passengerId: dto.passengerId,
            pickupLocation: dto.pickupLocation,
            destination: dto.destination,
            rideType: dto.rideType,
            estimatedDistanceKm: Math.round(distanceKm * 100) / 100,
            estimatedDurationMinutes: Math.round(durationMinutes),
            estimatedFare,
            status: ride_enum_1.RideStatus.REQUESTED,
            requestExpiresAt: new Date(Date.now() + this.matchingService.requestTimeoutSeconds * 1000),
        });
        await this.dispatchToNextCandidate(ride);
        return ride;
    }
    async dispatchToNextCandidate(ride) {
        const candidates = await this.matchingService.findCandidates(ride.pickupLocation.lat, ride.pickupLocation.lng, ride.rejectedDriverIds.map(String));
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
    async acceptRide(rideId, driverId) {
        const ride = await this.getOrThrow(rideId);
        if (ride.status !== ride_enum_1.RideStatus.REQUESTED) {
            throw new common_1.BadRequestException(`Ride is no longer requestable (status: ${ride.status})`);
        }
        if (ride.requestExpiresAt && ride.requestExpiresAt.getTime() < Date.now()) {
            await this.expireRide(ride);
            throw new common_1.BadRequestException('Ride request has expired');
        }
        const assignedDriver = await this.matchingService.tryAssignDriver(driverId, ride._id);
        if (!assignedDriver) {
            throw new common_1.BadRequestException('Driver is not available (already on a ride or offline)');
        }
        ride.driverId = new mongoose_2.Types.ObjectId(driverId);
        ride.status = ride_enum_1.RideStatus.ACCEPTED;
        ride.acceptedAt = new Date();
        await ride.save();
        this.eventEmitter.emit('ride.accepted', { rideId: String(ride._id), driverId, passengerId: String(ride.passengerId) });
        return ride;
    }
    async rejectRide(rideId, driverId) {
        const ride = await this.getOrThrow(rideId);
        if (ride.status !== ride_enum_1.RideStatus.REQUESTED) {
            throw new common_1.BadRequestException('Ride is no longer pending');
        }
        ride.rejectedDriverIds.push(new mongoose_2.Types.ObjectId(driverId));
        await ride.save();
        await this.dispatchToNextCandidate(ride);
        return ride;
    }
    async transition(rideId, driverId, next) {
        const ride = await this.getOrThrow(rideId);
        if (String(ride.driverId) !== driverId) {
            throw new common_1.ForbiddenException('Only the assigned driver can update this ride');
        }
        this.assertTransitionAllowed(ride.status, next);
        switch (next) {
            case ride_enum_1.RideStatus.ARRIVING:
                ride.arrivingAt = new Date();
                break;
            case ride_enum_1.RideStatus.STARTED:
                ride.startedAt = new Date();
                break;
            case ride_enum_1.RideStatus.COMPLETED:
                return this.completeRide(ride);
            default:
                break;
        }
        ride.status = next;
        await ride.save();
        this.eventEmitter.emit('ride.status_changed', { rideId: String(ride._id), status: next });
        return ride;
    }
    async completeRide(ride) {
        ride.status = ride_enum_1.RideStatus.COMPLETED;
        ride.completedAt = new Date();
        ride.actualFare = ride.estimatedFare;
        await ride.save();
        await this.driversService.releaseFromRide(String(ride.driverId));
        await this.driversService.recordCompletedRide(String(ride.driverId), ride.actualFare.total);
        await this.passengersService.recordCompletedRide(String(ride.passengerId), ride.actualFare.total);
        this.eventEmitter.emit('ride.completed', { rideId: String(ride._id) });
        return ride;
    }
    async cancelRide(rideId, dto) {
        const ride = await this.getOrThrow(rideId);
        this.assertTransitionAllowed(ride.status, ride_enum_1.RideStatus.CANCELLED);
        ride.status = ride_enum_1.RideStatus.CANCELLED;
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
    assertTransitionAllowed(current, next) {
        const allowed = ride_enum_1.RIDE_STATUS_TRANSITIONS[current] ?? [];
        if (!allowed.includes(next)) {
            throw new common_1.BadRequestException(`Cannot transition ride from ${current} to ${next}`);
        }
    }
    async sweepExpiredRequests() {
        const stale = await this.rideModel.find({
            status: ride_enum_1.RideStatus.REQUESTED,
            requestExpiresAt: { $lt: new Date() },
        });
        for (const ride of stale) {
            await this.expireRide(ride);
        }
    }
    async expireRide(ride) {
        ride.status = ride_enum_1.RideStatus.EXPIRED;
        await ride.save();
        this.eventEmitter.emit('ride.expired', { rideId: String(ride._id), passengerId: String(ride.passengerId) });
        this.logger.log(`Ride ${ride._id} expired (no driver accepted in time)`);
    }
    async countActiveRequests() {
        return this.rideModel.countDocuments({ status: ride_enum_1.RideStatus.REQUESTED });
    }
    async getOrThrow(rideId) {
        const ride = await this.rideModel.findById(rideId);
        if (!ride)
            throw new common_1.NotFoundException('Ride not found');
        return ride;
    }
    async getPassengerHistory(passengerId) {
        const rides = await this.rideModel
            .find({ passengerId, status: { $in: [ride_enum_1.RideStatus.COMPLETED, ride_enum_1.RideStatus.CANCELLED] } })
            .sort({ createdAt: -1 });
        const totalSpending = rides
            .filter((r) => r.status === ride_enum_1.RideStatus.COMPLETED)
            .reduce((sum, r) => sum + (r.actualFare?.total ?? 0), 0);
        return { rides, totalSpending, totalRides: rides.length };
    }
    async getDriverHistory(driverId) {
        const rides = await this.rideModel
            .find({ driverId, status: { $in: [ride_enum_1.RideStatus.COMPLETED, ride_enum_1.RideStatus.CANCELLED] } })
            .sort({ createdAt: -1 });
        const totalEarnings = rides
            .filter((r) => r.status === ride_enum_1.RideStatus.COMPLETED)
            .reduce((sum, r) => sum + (r.actualFare?.total ?? 0), 0);
        return { rides, totalEarnings, completedRides: rides.filter((r) => r.status === ride_enum_1.RideStatus.COMPLETED).length };
    }
};
exports.RidesService = RidesService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RidesService.prototype, "sweepExpiredRequests", null);
exports.RidesService = RidesService = RidesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(ride_schema_1.Ride.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        fare_service_1.FareService,
        drivers_service_1.DriversService,
        passengers_service_1.PassengersService,
        matching_service_1.MatchingService,
        event_emitter_1.EventEmitter2])
], RidesService);
//# sourceMappingURL=rides.service.js.map