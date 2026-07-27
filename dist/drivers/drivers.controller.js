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
exports.DriversController = void 0;
const common_1 = require("@nestjs/common");
const drivers_service_1 = require("./drivers.service");
const driver_dto_1 = require("./dto/driver.dto");
let DriversController = class DriversController {
    constructor(driversService) {
        this.driversService = driversService;
    }
    getalldrivers() {
        return this.driversService.getallddrivers();
    }
    findNearby(query) {
        return this.driversService.findNearbyAvailable(query.lat, query.lng, query.radiusKm ?? 5);
    }
    onboard(dto) {
        return this.driversService.onboard(dto);
    }
    getById(id) {
        return this.driversService.findById(id);
    }
    setVerification(id, dto) {
        return this.driversService.setVerificationStatus(id, dto.verificationStatus);
    }
    setStatus(id, dto) {
        return this.driversService.setStatus(id, dto.status);
    }
    updateLocation(id, dto) {
        return this.driversService.updateLocation(id, dto);
    }
};
exports.DriversController = DriversController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getalldrivers", null);
__decorate([
    (0, common_1.Get)("nearby"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_dto_1.NearbyDriversQueryDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_dto_1.CreateDriverDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "onboard", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(":id/verification"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, driver_dto_1.UpdateVerificationDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "setVerification", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, driver_dto_1.UpdateDriverStatusDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "setStatus", null);
__decorate([
    (0, common_1.Patch)(":id/location"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, driver_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateLocation", null);
exports.DriversController = DriversController = __decorate([
    (0, common_1.Controller)("drivers"),
    __metadata("design:paramtypes", [drivers_service_1.DriversService])
], DriversController);
//# sourceMappingURL=drivers.controller.js.map