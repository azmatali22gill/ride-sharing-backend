"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RIDE_STATUS_TRANSITIONS = exports.RideType = exports.RideStatus = void 0;
var RideStatus;
(function (RideStatus) {
    RideStatus["REQUESTED"] = "REQUESTED";
    RideStatus["ACCEPTED"] = "ACCEPTED";
    RideStatus["ARRIVING"] = "ARRIVING";
    RideStatus["STARTED"] = "STARTED";
    RideStatus["COMPLETED"] = "COMPLETED";
    RideStatus["CANCELLED"] = "CANCELLED";
    RideStatus["EXPIRED"] = "EXPIRED";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
var RideType;
(function (RideType) {
    RideType["ECONOMY"] = "ECONOMY";
    RideType["COMFORT"] = "COMFORT";
    RideType["PREMIUM"] = "PREMIUM";
    RideType["XL"] = "XL";
})(RideType || (exports.RideType = RideType = {}));
exports.RIDE_STATUS_TRANSITIONS = {
    [RideStatus.REQUESTED]: [RideStatus.ACCEPTED, RideStatus.CANCELLED, RideStatus.EXPIRED],
    [RideStatus.ACCEPTED]: [RideStatus.ARRIVING, RideStatus.CANCELLED],
    [RideStatus.ARRIVING]: [RideStatus.STARTED, RideStatus.CANCELLED],
    [RideStatus.STARTED]: [RideStatus.COMPLETED, RideStatus.CANCELLED],
    [RideStatus.COMPLETED]: [],
    [RideStatus.CANCELLED]: [],
    [RideStatus.EXPIRED]: [],
};
//# sourceMappingURL=ride.enum.js.map