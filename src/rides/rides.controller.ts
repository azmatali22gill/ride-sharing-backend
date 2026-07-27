import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RidesService } from './rides.service';
import { CancelRideDto, RequestRideDto, RespondToRideDto } from './dto/ride.dto';
import { RideStatus } from '../common/enums/ride.enum';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Post()
  requestRide(@Body() dto: RequestRideDto) {
    return this.ridesService.requestRide(dto);
  }

  @Get('history/passenger/:passengerId')
  passengerHistory(@Param('passengerId') passengerId: string) {
    return this.ridesService.getPassengerHistory(passengerId);
  }

  @Get('history/driver/:driverId')
  driverHistory(@Param('driverId') driverId: string) {
    return this.ridesService.getDriverHistory(driverId);
  }

  @Get(':id')
  getRide(@Param('id') id: string) {
    return this.ridesService.getOrThrow(id);
  }

  @Patch(':id/accept')
  accept(@Param('id') id: string, @Body() dto: RespondToRideDto) {
    return this.ridesService.acceptRide(id, dto.driverId);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body() dto: RespondToRideDto) {
    return this.ridesService.rejectRide(id, dto.driverId);
  }

  @Patch(':id/arriving')
  arriving(@Param('id') id: string, @Body() dto: RespondToRideDto) {
    return this.ridesService.transition(id, dto.driverId, RideStatus.ARRIVING);
  }

  @Patch(':id/start')
  start(@Param('id') id: string, @Body() dto: RespondToRideDto) {
    return this.ridesService.transition(id, dto.driverId, RideStatus.STARTED);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string, @Body() dto: RespondToRideDto) {
    return this.ridesService.transition(id, dto.driverId, RideStatus.COMPLETED);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Body() dto: CancelRideDto) {
    return this.ridesService.cancelRide(id, dto);
  }

}
