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
exports.DriverSchema = exports.Driver = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const driver_enum_1 = require("../../common/enums/driver.enum");
let Vehicle = class Vehicle {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "make", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: false }),
    __metadata("design:type", String)
], Vehicle.prototype, "plateNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 4 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "capacity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "ECONOMY" }),
    __metadata("design:type", String)
], Vehicle.prototype, "category", void 0);
Vehicle = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Vehicle);
const VehicleSchema = mongoose_1.SchemaFactory.createForClass(Vehicle);
let GeoLocation = class GeoLocation {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ["Point"], default: "Point" }),
    __metadata("design:type", String)
], GeoLocation.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number], required: true }),
    __metadata("design:type", Array)
], GeoLocation.prototype, "coordinates", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], GeoLocation.prototype, "updatedAt", void 0);
GeoLocation = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], GeoLocation);
const GeoLocationSchema = mongoose_1.SchemaFactory.createForClass(GeoLocation);
let Driver = class Driver {
};
exports.Driver = Driver;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Driver.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], Driver.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], Driver.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: VehicleSchema, required: true }),
    __metadata("design:type", Vehicle)
], Driver.prototype, "vehicle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: driver_enum_1.VerificationStatus, default: driver_enum_1.VerificationStatus.PENDING }),
    __metadata("design:type", String)
], Driver.prototype, "verificationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: driver_enum_1.DriverStatus, default: driver_enum_1.DriverStatus.OFFLINE }),
    __metadata("design:type", String)
], Driver.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: GeoLocationSchema }),
    __metadata("design:type", GeoLocation)
], Driver.prototype, "currentLocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "ratingAverage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "ratingCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "totalRidesCompleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "totalEarnings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Ride", default: null }),
    __metadata("design:type", Object)
], Driver.prototype, "activeRideId", void 0);
exports.Driver = Driver = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Driver);
exports.DriverSchema = mongoose_1.SchemaFactory.createForClass(Driver);
exports.DriverSchema.index({ currentLocation: "2dsphere" });
exports.DriverSchema.index({ status: 1 });
//# sourceMappingURL=driver.schema.js.map