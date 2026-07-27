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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rating_schema_1 = require("./schemas/rating.schema");
const rating_enum_1 = require("../common/enums/rating.enum");
const rides_service_1 = require("../rides/rides.service");
const drivers_service_1 = require("../drivers/drivers.service");
const passengers_service_1 = require("../passengers/passengers.service");
const ride_enum_1 = require("../common/enums/ride.enum");
let RatingsService = class RatingsService {
    constructor(ratingModel, ridesService, driversService, passengersService) {
        this.ratingModel = ratingModel;
        this.ridesService = ridesService;
        this.driversService = driversService;
        this.passengersService = passengersService;
    }
    async submitRating(dto) {
        const ride = await this.ridesService.getOrThrow(dto.rideId);
        if (ride.status !== ride_enum_1.RideStatus.COMPLETED) {
            throw new common_1.BadRequestException('Ratings can only be submitted for completed rides');
        }
        const passengerId = String(ride.passengerId);
        const driverId = String(ride.driverId);
        if (dto.raterType === rating_enum_1.RaterType.PASSENGER) {
            if (dto.fromUserId !== passengerId || dto.toUserId !== driverId) {
                throw new common_1.BadRequestException('Passenger rating must go from the ride passenger to the ride driver');
            }
        }
        else {
            if (dto.fromUserId !== driverId || dto.toUserId !== passengerId) {
                throw new common_1.BadRequestException('Driver rating must go from the ride driver to the ride passenger');
            }
        }
        const existing = await this.ratingModel.findOne({ rideId: dto.rideId, raterType: dto.raterType });
        if (existing) {
            throw new common_1.ConflictException('This ride has already been rated in this direction');
        }
        const rating = await this.ratingModel.create(dto);
        if (dto.raterType === rating_enum_1.RaterType.PASSENGER) {
            await this.driversService.applyRating(driverId, dto.rating);
        }
        else {
            await this.passengersService.applyRating(passengerId, dto.rating);
        }
        return rating;
    }
    async getForRide(rideId) {
        return this.ratingModel.find({ rideId });
    }
    async getForUser(userId) {
        return this.ratingModel.find({ toUserId: userId }).sort({ createdAt: -1 });
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(rating_schema_1.Rating.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        rides_service_1.RidesService,
        drivers_service_1.DriversService,
        passengers_service_1.PassengersService])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map