"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const drivers_module_1 = require("./drivers/drivers.module");
const passengers_module_1 = require("./passengers/passengers.module");
const rides_module_1 = require("./rides/rides.module");
const fare_module_1 = require("./fare/fare.module");
const location_module_1 = require("./location/location.module");
const ratings_module_1 = require("./ratings/ratings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('MONGODB_URI') ?? 'mongodb://localhost:27017/ride_sharing',
                }),
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            drivers_module_1.DriversModule,
            passengers_module_1.PassengersModule,
            fare_module_1.FareModule,
            rides_module_1.RidesModule,
            location_module_1.LocationModule,
            ratings_module_1.RatingsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map