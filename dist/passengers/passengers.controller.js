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
exports.PassengersController = void 0;
const common_1 = require("@nestjs/common");
const passengers_service_1 = require("./passengers.service");
const passenger_dto_1 = require("./dto/passenger.dto");
let PassengersController = class PassengersController {
    constructor(passengersService) {
        this.passengersService = passengersService;
    }
    getroot() {
        return "its a ride sharing backend task assigned by miss poja.";
    }
    register(dto) {
        return this.passengersService.register(dto);
    }
    getById(id) {
        return this.passengersService.findById(id);
    }
};
exports.PassengersController = PassengersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], PassengersController.prototype, "getroot", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [passenger_dto_1.CreatePassengerDto]),
    __metadata("design:returntype", void 0)
], PassengersController.prototype, "register", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PassengersController.prototype, "getById", null);
exports.PassengersController = PassengersController = __decorate([
    (0, common_1.Controller)("passengers"),
    __metadata("design:paramtypes", [passengers_service_1.PassengersService])
], PassengersController);
//# sourceMappingURL=passengers.controller.js.map