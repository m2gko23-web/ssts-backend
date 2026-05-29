import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransportService } from './transport.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/roles.decorator';
import { Role, TripStatus } from '@common/enums/roles.enum';

@ApiTags('Transport')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  // ---- BUSES ----
  @Post('buses')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Add a new bus' })
  createBus(@Body() dto: any) {
    return this.transportService.createBus(dto);
  }

  @Get('buses')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.DRIVER)
  @ApiOperation({ summary: 'Get all active buses' })
  findAllBuses() {
    return this.transportService.findAllBuses();
  }

  @Get('buses/:id')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.DRIVER)
  @ApiOperation({ summary: 'Get bus by ID' })
  findBus(@Param('id') id: string) {
    return this.transportService.findBusById(id);
  }

  @Patch('buses/:id/location')
  @Roles(Role.DRIVER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Driver: update bus GPS location' })
  updateBusLocation(
    @Param('id') id: string,
    @Body('lat') lat: number,
    @Body('lng') lng: number,
  ) {
    return this.transportService.updateBusLocation(id, lat, lng);
  }

  // ---- TRIPS ----
  @Post('trips')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Create a new trip' })
  createTrip(@Body() dto: any) {
    return this.transportService.createTrip(dto);
  }

  @Get('trips')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Get all trips (optionally filter by date)' })
  @ApiQuery({ name: 'date', required: false })
  findAllTrips(@Query('date') date?: string) {
    return this.transportService.findAllTrips(date);
  }

  @Get('trips/active')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Get all currently active trips' })
  findActiveTrips() {
    return this.transportService.findActiveTrips();
  }

  @Get('trips/my')
  @Roles(Role.DRIVER)
  @ApiOperation({ summary: 'Driver: get my assigned trips' })
  @ApiQuery({ name: 'date', required: false })
  findMyTrips(@CurrentUser('sub') driverId: string, @Query('date') date?: string) {
    return this.transportService.findDriverTrips(driverId, date);
  }

  @Get('trips/:id')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.DRIVER)
  @ApiOperation({ summary: 'Get trip details' })
  findTrip(@Param('id') id: string) {
    return this.transportService.findTripById(id);
  }

  @Patch('trips/:id/start')
  @Roles(Role.DRIVER, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Start a trip' })
  startTrip(@Param('id') id: string) {
    return this.transportService.startTrip(id);
  }

  @Patch('trips/:id/end')
  @Roles(Role.DRIVER, Role.SUPERVISOR)
  @ApiOperation({ summary: 'End a trip' })
  endTrip(@Param('id') id: string) {
    return this.transportService.endTrip(id);
  }
}