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
var MatchingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const drivers_service_1 = require("../drivers/drivers.service");
let MatchingService = MatchingService_1 = class MatchingService {
    constructor(driversService, configService, eventEmitter) {
        this.driversService = driversService;
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(MatchingService_1.name);
        this.defaultRadiusKm = Number(this.configService.get('DRIVER_SEARCH_RADIUS_KM') ?? 5);
        this.requestTimeoutSeconds = Number(this.configService.get('RIDE_REQUEST_TIMEOUT_SECONDS') ?? 30);
    }
    async findCandidates(lat, lng, excludeDriverIds = [], radiusKm) {
        const drivers = await this.driversService.findNearbyAvailable(lat, lng, radiusKm ?? this.defaultRadiusKm);
        const excluded = new Set(excludeDriverIds.map(String));
        return drivers.filter((d) => !excluded.has(String(d._id)));
    }
    dispatchToDriver(driverId, ridePayload) {
        this.logger.log(`Dispatching ride ${ridePayload.rideId} to driver ${driverId}`);
        this.eventEmitter.emit('ride.dispatch', { driverId, ride: ridePayload });
    }
    async tryAssignDriver(driverId, rideId) {
        return this.driversService.assignToRide(driverId, rideId);
    }
};
exports.MatchingService = MatchingService;
exports.MatchingService = MatchingService = MatchingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drivers_service_1.DriversService,
        config_1.ConfigService,
        event_emitter_1.EventEmitter2])
], MatchingService);
//# sourceMappingURL=matching.service.js.map