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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideSchema = exports.Ride = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ride_enum_1 = require("../../common/enums/ride.enum");
let RidePoint = class RidePoint {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], RidePoint.prototype, "lat", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], RidePoint.prototype, "lng", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RidePoint.prototype, "address", void 0);
RidePoint = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], RidePoint);
const RidePointSchema = mongoose_1.SchemaFactory.createForClass(RidePoint);
let FareSnapshot = class FareSnapshot {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FareSnapshot.prototype, "baseFare", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FareSnapshot.prototype, "distanceCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FareSnapshot.prototype, "timeCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 1 }),
    __metadata("design:type", Number)
], FareSnapshot.prototype, "surgeMultiplier", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FareSnapshot.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'PKR' }),
    __metadata("design:type", String)
], FareSnapshot.prototype, "currency", void 0);
FareSnapshot = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], FareSnapshot);
const FareSnapshotSchema = mongoose_1.SchemaFactory.createForClass(FareSnapshot);
let Ride = class Ride {
};
exports.Ride = Ride;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Passenger', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Ride.prototype, "passengerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Driver', default: null }),
    __metadata("design:type", Object)
], Ride.prototype, "driverId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: RidePointSchema, required: true }),
    __metadata("design:type", RidePoint)
], Ride.prototype, "pickupLocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: RidePointSchema, required: true }),
    __metadata("design:type", RidePoint)
], Ride.prototype, "destination", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ride_enum_1.RideType, required: true }),
    __metadata("design:type", String)
], Ride.prototype, "rideType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Ride.prototype, "estimatedDistanceKm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Ride.prototype, "estimatedDurationMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: FareSnapshotSchema, required: true }),
    __metadata("design:type", FareSnapshot)
], Ride.prototype, "estimatedFare", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: FareSnapshotSchema, default: null }),
    __metadata("design:type", Object)
], Ride.prototype, "actualFare", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ride_enum_1.RideStatus, default: ride_enum_1.RideStatus.REQUESTED }),
    __metadata("design:type", String)
], Ride.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'Driver', default: [] }),
    __metadata("design:type", Array)
], Ride.prototype, "rejectedDriverIds", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Ride.prototype, "requestExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Ride.prototype, "acceptedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Ride.prototype, "arrivingAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Ride.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Ride.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Ride.prototype, "cancelledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Ride.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Ride.prototype, "cancelledBy", void 0);
exports.Ride = Ride = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Ride);
exports.RideSchema = mongoose_1.SchemaFactory.createForClass(Ride);
exports.RideSchema.index({ passengerId: 1, createdAt: -1 });
exports.RideSchema.index({ driverId: 1, createdAt: -1 });
exports.RideSchema.index({ status: 1 });
//# sourceMappingURL=ride.schema.js.map