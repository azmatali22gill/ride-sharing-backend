"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FareService = void 0;
const common_1 = require("@nestjs/common");
const ride_enum_1 = require("../common/enums/ride.enum");
const RIDE_TYPE_CONFIG = {
    [ride_enum_1.RideType.ECONOMY]: { base: 80, perKm: 25, perMin: 3, multiplier: 1.0 },
    [ride_enum_1.RideType.COMFORT]: { base: 120, perKm: 32, perMin: 4, multiplier: 1.2 },
    [ride_enum_1.RideType.PREMIUM]: { base: 180, perKm: 45, perMin: 6, multiplier: 1.5 },
    [ride_enum_1.RideType.XL]: { base: 150, perKm: 38, perMin: 5, multiplier: 1.35 },
};
const MINIMUM_FARE = 100;
let FareService = class FareService {
    estimateFare(distanceKm, durationMinutes, rideType, surgeMultiplier = 1) {
        const config = RIDE_TYPE_CONFIG[rideType];
        const baseFare = config.base;
        const distanceCost = Math.round(distanceKm * config.perKm);
        const timeCost = Math.round(durationMinutes * config.perMin);
        const subtotal = (baseFare + distanceCost + timeCost) * config.multiplier;
        const total = Math.max(Math.round(subtotal * surgeMultiplier), MINIMUM_FARE);
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
    calculateSurgeMultiplier(pendingRequests, availableDrivers) {
        if (availableDrivers <= 0)
            return 3;
        const ratio = pendingRequests / availableDrivers;
        if (ratio <= 1)
            return 1;
        if (ratio <= 2)
            return 1.3;
        if (ratio <= 3)
            return 1.6;
        if (ratio <= 5)
            return 2.2;
        return 3;
    }
};
exports.FareService = FareService;
exports.FareService = FareService = __decorate([
    (0, common_1.Injectable)()
], FareService);
//# sourceMappingURL=fare.service.js.map