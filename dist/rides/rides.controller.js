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
exports.RidesController = void 0;
const common_1 = require("@nestjs/common");
const rides_service_1 = require("./rides.service");
const ride_dto_1 = require("./dto/ride.dto");
const ride_enum_1 = require("../common/enums/ride.enum");
let RidesController = class RidesController {
    constructor(ridesService) {
        this.ridesService = ridesService;
    }
    requestRide(dto) {
        return this.ridesService.requestRide(dto);
    }
    passengerHistory(passengerId) {
        return this.ridesService.getPassengerHistory(passengerId);
    }
    driverHistory(driverId) {
        return this.ridesService.getDriverHistory(driverId);
    }
    getRide(id) {
        return this.ridesService.getOrThrow(id);
    }
    accept(id, dto) {
        return this.ridesService.acceptRide(id, dto.driverId);
    }
    reject(id, dto) {
        return this.ridesService.rejectRide(id, dto.driverId);
    }
    arriving(id, dto) {
        return this.ridesService.transition(id, dto.driverId, ride_enum_1.RideStatus.ARRIVING);
    }
    start(id, dto) {
        return this.ridesService.transition(id, dto.driverId, ride_enum_1.RideStatus.STARTED);
    }
    complete(id, dto) {
        return this.ridesService.transition(id, dto.driverId, ride_enum_1.RideStatus.COMPLETED);
    }
    cancel(id, dto) {
        return this.ridesService.cancelRide(id, dto);
    }
};
exports.RidesController = RidesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ride_dto_1.RequestRideDto]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "requestRide", null);
__decorate([
    (0, common_1.Get)('history/passenger/:passengerId'),
    __param(0, (0, common_1.Param)('passengerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "passengerHistory", null);
__decorate([
    (0, common_1.Get)('history/driver/:driverId'),
    __param(0, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "driverHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "getRide", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ride_dto_1.RespondToRideDto]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "accept", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ride_dto_1.RespondToRideDto]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/arriving'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ride_dto_1.RespondToRideDto]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "arriving", null);
__decorate([
    (0, common_1.Patch)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ride_dto_1.RespondToRideDto]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "start", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ride_dto_1.RespondToRideDto]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "complete", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ride_dto_1.CancelRideDto]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "cancel", null);
exports.RidesController = RidesController = __decorate([
    (0, common_1.Controller)('rides'),
    __metadata("design:paramtypes", [rides_service_1.RidesService])
], RidesController);
//# sourceMappingURL=rides.controller.js.map