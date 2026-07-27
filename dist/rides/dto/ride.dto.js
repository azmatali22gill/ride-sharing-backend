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
exports.CancelRideDto = exports.RespondToRideDto = exports.RequestRideDto = exports.RidePointDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const ride_enum_1 = require("../../common/enums/ride.enum");
class RidePointDto {
}
exports.RidePointDto = RidePointDto;
__decorate([
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], RidePointDto.prototype, "lat", void 0);
__decorate([
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], RidePointDto.prototype, "lng", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RidePointDto.prototype, "address", void 0);
class RequestRideDto {
}
exports.RequestRideDto = RequestRideDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], RequestRideDto.prototype, "passengerId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RidePointDto),
    __metadata("design:type", RidePointDto)
], RequestRideDto.prototype, "pickupLocation", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RidePointDto),
    __metadata("design:type", RidePointDto)
], RequestRideDto.prototype, "destination", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ride_enum_1.RideType),
    __metadata("design:type", String)
], RequestRideDto.prototype, "rideType", void 0);
class RespondToRideDto {
}
exports.RespondToRideDto = RespondToRideDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], RespondToRideDto.prototype, "driverId", void 0);
class CancelRideDto {
}
exports.CancelRideDto = CancelRideDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelRideDto.prototype, "cancelledBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelRideDto.prototype, "reason", void 0);
//# sourceMappingURL=ride.dto.js.map