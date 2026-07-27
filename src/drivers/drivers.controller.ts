import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { DriversService } from "./drivers.service";
import {
  CreateDriverDto,
  NearbyDriversQueryDto,
  UpdateDriverStatusDto,
  UpdateLocationDto,
  UpdateVerificationDto,
} from "./dto/driver.dto";


@Controller("drivers")
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  getalldrivers() {
    return this.driversService.getallddrivers();
  }

  @Get("nearby")
  findNearby(@Query() query: NearbyDriversQueryDto) {
    return this.driversService.findNearbyAvailable(
      query.lat,
      query.lng,
      query.radiusKm ?? 5,
    );
  }

  @Post()
  onboard(@Body() dto: CreateDriverDto) {
    return this.driversService.onboard(dto);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.driversService.findById(id);
  }

  @Patch(":id/verification")
  setVerification(@Param("id") id: string, @Body() dto: UpdateVerificationDto) {
    return this.driversService.setVerificationStatus(
      id,
      dto.verificationStatus,
    );
  }

  @Patch(":id/status")
  setStatus(@Param("id") id: string, @Body() dto: UpdateDriverStatusDto) {
    return this.driversService.setStatus(id, dto.status);
  }

  @Patch(":id/location")
  updateLocation(@Param("id") id: string, @Body() dto: UpdateLocationDto) {
    return this.driversService.updateLocation(id, dto);
  }
}
