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
var LocationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationGateway = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let LocationGateway = LocationGateway_1 = class LocationGateway {
    constructor() {
        this.logger = new common_1.Logger(LocationGateway_1.name);
        this.driverSockets = new Map();
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        for (const [driverId, socketId] of this.driverSockets.entries()) {
            if (socketId === client.id)
                this.driverSockets.delete(driverId);
        }
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    registerDriver(client, payload) {
        this.driverSockets.set(payload.driverId, client.id);
        client.join(`driver:${payload.driverId}`);
        return { status: "ok" };
    }
    joinRide(client, payload) {
        client.join(`ride:${payload.rideId}`);
        return { status: "ok" };
    }
    leaveRide(client, payload) {
        client.leave(`ride:${payload.rideId}`);
        return { status: "ok" };
    }
    handleDriverLocation(payload) {
        if (payload.rideId) {
            this.server.to(`ride:${payload.rideId}`).emit("driver:location", {
                driverId: payload.driverId,
                lat: payload.lat,
                lng: payload.lng,
                timestamp: new Date().toISOString(),
            });
        }
    }
    onRideDispatch({ driverId, ride, }) {
        this.server.to(`driver:${driverId}`).emit("ride:offer", ride);
    }
    onRideAccepted(payload) {
        this.server.to(`ride:${payload.rideId}`).emit("ride:accepted", payload);
    }
    onRideStatusChanged(payload) {
        this.server.to(`ride:${payload.rideId}`).emit("ride:status", payload);
    }
    onRideCompleted(payload) {
        this.server.to(`ride:${payload.rideId}`).emit("ride:completed", payload);
    }
    onRideCancelled(payload) {
        this.server.to(`ride:${payload.rideId}`).emit("ride:cancelled", payload);
    }
    onRideExpired(payload) {
        this.server.to(`ride:${payload.rideId}`).emit("ride:expired", payload);
    }
};
exports.LocationGateway = LocationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], LocationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("driver:register"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "registerDriver", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("ride:join"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "joinRide", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("ride:leave"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "leaveRide", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("driver:location"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "handleDriverLocation", null);
__decorate([
    (0, event_emitter_1.OnEvent)("ride.dispatch"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "onRideDispatch", null);
__decorate([
    (0, event_emitter_1.OnEvent)("ride.accepted"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "onRideAccepted", null);
__decorate([
    (0, event_emitter_1.OnEvent)("ride.status_changed"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "onRideStatusChanged", null);
__decorate([
    (0, event_emitter_1.OnEvent)("ride.completed"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "onRideCompleted", null);
__decorate([
    (0, event_emitter_1.OnEvent)("ride.cancelled"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "onRideCancelled", null);
__decorate([
    (0, event_emitter_1.OnEvent)("ride.expired"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LocationGateway.prototype, "onRideExpired", null);
exports.LocationGateway = LocationGateway = LocationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: "*" },
        namespace: "/realtime",
    })
], LocationGateway);
//# sourceMappingURL=location.gateway.js.map