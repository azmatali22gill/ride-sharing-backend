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
exports.NearbyDriversQueryDto = exports.UpdateLocationDto = exports.UpdateDriverStatusDto = exports.UpdateVerificationDto = exports.CreateDriverDto = exports.VehicleDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const driver_enum_1 = require("../../common/enums/driver.enum");
class VehicleDto {
}
exports.VehicleDto = VehicleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VehicleDto.prototype, "make", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VehicleDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VehicleDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VehicleDto.prototype, "plateNumber", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], VehicleDto.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["ECONOMY", "COMFORT", "PREMIUM", "XL"]),
    __metadata("design:type", String)
], VehicleDto.prototype, "category", void 0);
class CreateDriverDto {
}
exports.CreateDriverDto = CreateDriverDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateDriverDto.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => VehicleDto),
    __metadata("design:type", VehicleDto)
], CreateDriverDto.prototype, "vehicle", void 0);
class UpdateVerificationDto {
}
exports.UpdateVerificationDto = UpdateVerificationDto;
__decorate([
    (0, class_validator_1.IsEnum)(driver_enum_1.VerificationStatus),
    __metadata("design:type", String)
], UpdateVerificationDto.prototype, "verificationStatus", void 0);
class UpdateDriverStatusDto {
}
exports.UpdateDriverStatusDto = UpdateDriverStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(driver_enum_1.DriverStatus),
    __metadata("design:type", String)
], UpdateDriverStatusDto.prototype, "status", void 0);
class UpdateLocationDto {
}
exports.UpdateLocationDto = UpdateLocationDto;
__decorate([
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], UpdateLocationDto.prototype, "lat", void 0);
__decorate([
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], UpdateLocationDto.prototype, "lng", void 0);
class NearbyDriversQueryDto {
}
exports.NearbyDriversQueryDto = NearbyDriversQueryDto;
__decorate([
    (0, class_validator_1.IsLatitude)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], NearbyDriversQueryDto.prototype, "lat", void 0);
__decorate([
    (0, class_validator_1.IsLongitude)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], NearbyDriversQueryDto.prototype, "lng", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], NearbyDriversQueryDto.prototype, "radiusKm", void 0);
//# sourceMappingURL=driver.dto.js.map