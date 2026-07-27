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
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const driver_schema_1 = require("./schemas/driver.schema");
const driver_enum_1 = require("../common/enums/driver.enum");
let DriversService = class DriversService {
    constructor(driverModel) {
        this.driverModel = driverModel;
    }
    async onboard(dto) {
        if (dto.age < 18 || dto.age > 60) {
            throw new common_1.BadRequestException("Driver age must be between 18 and 60 years");
        }
        if (dto.gender.toLowerCase() !== "male") {
            throw new common_1.BadRequestException("Only male drivers are allowed to onboard");
        }
        const existing = await this.driverModel.findOne({
            $or: [
                { email: dto.email },
                { phone: dto.phone },
            ],
        });
        if (existing) {
            throw new common_1.ConflictException("Driver with this email or phone already exists");
        }
        return this.driverModel.create({
            ...dto,
            status: driver_enum_1.DriverStatus.OFFLINE,
            verificationStatus: driver_enum_1.VerificationStatus.PENDING,
        });
    }
    async findById(id) {
        const driver = await this.driverModel.findById(id);
        if (!driver)
            throw new common_1.NotFoundException("Driver not found");
        return driver;
    }
    async setVerificationStatus(id, status) {
        const driver = await this.findById(id);
        driver.verificationStatus = status;
        if (status !== driver_enum_1.VerificationStatus.VERIFIED) {
            driver.status = driver_enum_1.DriverStatus.OFFLINE;
        }
        return driver.save();
    }
    async setStatus(id, status) {
        const driver = await this.findById(id);
        if (status === driver_enum_1.DriverStatus.AVAILABLE &&
            driver.verificationStatus !== driver_enum_1.VerificationStatus.VERIFIED) {
            throw new common_1.BadRequestException("Driver must be verified before going online");
        }
        if (driver.status === driver_enum_1.DriverStatus.BUSY && status !== driver_enum_1.DriverStatus.BUSY) {
            throw new common_1.BadRequestException("Cannot change status while an active ride is in progress");
        }
        driver.status = status;
        return driver.save();
    }
    async updateLocation(id, dto) {
        const driver = await this.findById(id);
        driver.currentLocation = {
            type: "Point",
            coordinates: [dto.lng, dto.lat],
            updatedAt: new Date(),
        };
        return driver.save();
    }
    async getallddrivers() {
        return [
            {
                name: "Anas",
                age: 56,
            },
            {
                name: "Ali",
                age: 30,
            },
            {
                name: "Ahmed",
                age: 25,
            },
        ];
    }
    async findNearbyAvailable(lat, lng, radiusKm) {
        return this.driverModel.find({
            status: driver_enum_1.DriverStatus.AVAILABLE,
            verificationStatus: driver_enum_1.VerificationStatus.VERIFIED,
            currentLocation: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: radiusKm * 1000,
                },
            },
        });
    }
    async assignToRide(driverId, rideId) {
        return this.driverModel.findOneAndUpdate({ _id: driverId, status: driver_enum_1.DriverStatus.AVAILABLE }, { status: driver_enum_1.DriverStatus.BUSY, activeRideId: rideId }, { new: true });
    }
    async releaseFromRide(driverId) {
        return this.driverModel.findOneAndUpdate({ _id: driverId }, { status: driver_enum_1.DriverStatus.AVAILABLE, activeRideId: null }, { new: true });
    }
    async recordCompletedRide(driverId, fare) {
        return this.driverModel.findByIdAndUpdate(driverId, {
            $inc: { totalRidesCompleted: 1, totalEarnings: fare },
        });
    }
    async applyRating(driverId, rating) {
        const driver = await this.findById(driverId);
        const newCount = driver.ratingCount + 1;
        const newAvg = (driver.ratingAverage * driver.ratingCount + rating) / newCount;
        driver.ratingAverage = Math.round(newAvg * 100) / 100;
        driver.ratingCount = newCount;
        return driver.save();
    }
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(driver_schema_1.Driver.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DriversService);
//# sourceMappingURL=drivers.service.js.map