import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PassengersService } from "./passengers.service";
import { CreatePassengerDto } from "./dto/passenger.dto";

@Controller("passengers")
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}
  @Get()
  getroot(): string {
    return "its a ride sharing backend task assigned by miss poja.";
  }
  @Post()
  register(@Body() dto: CreatePassengerDto) {
    return this.passengersService.register(dto);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.passengersService.findById(id);
  }
}
