"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const ride_schema_1 = require("./schemas/ride.schema");
const rides_service_1 = require("./rides.service");
const rides_controller_1 = require("./rides.controller");
const matching_service_1 = require("./matching.service");
const fare_module_1 = require("../fare/fare.module");
const drivers_module_1 = require("../drivers/drivers.module");
const passengers_module_1 = require("../passengers/passengers.module");
let RidesModule = class RidesModule {
};
exports.RidesModule = RidesModule;
exports.RidesModule = RidesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: ride_schema_1.Ride.name, schema: ride_schema_1.RideSchema }]),
            fare_module_1.FareModule,
            drivers_module_1.DriversModule,
            passengers_module_1.PassengersModule,
        ],
        controllers: [rides_controller_1.RidesController],
        providers: [rides_service_1.RidesService, matching_service_1.MatchingService],
        exports: [rides_service_1.RidesService, matching_service_1.MatchingService],
    })
], RidesModule);
//# sourceMappingURL=rides.module.js.map