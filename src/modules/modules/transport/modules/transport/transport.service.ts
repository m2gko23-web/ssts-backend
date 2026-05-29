import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bus } from './entities/bus.entity';
import { Trip } from './entities/trip.entity';
import { TripStatus } from '@common/enums/roles.enum';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Bus)
    private busRepository: Repository<Bus>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
  ) {}

  // ---- BUS CRUD ----
  async createBus(dto: Partial<Bus>): Promise<Bus> {
    const bus = this.busRepository.create(dto);
    return this.busRepository.save(bus);
  }

  async findAllBuses(): Promise<Bus[]> {
    return this.busRepository.find({ where: { isActive: true } });
  }

  async findBusById(id: string): Promise<Bus> {
    const bus = await this.busRepository.findOne({ where: { id } });
    if (!bus) throw new NotFoundException(`Bus ${id} not found`);
    return bus;
  }

  async updateBus(id: string, dto: Partial<Bus>): Promise<Bus> {
    const bus = await this.findBusById(id);
    Object.assign(bus, dto);
    return this.busRepository.save(bus);
  }

  async updateBusLocation(id: string, lat: number, lng: number): Promise<void> {
    await this.busRepository.update(id, {
      currentLatitude: lat,
      currentLongitude: lng,
      lastGpsUpdate: new Date(),
    });
  }

  // ---- TRIP CRUD ----
  async createTrip(dto: Partial<Trip>): Promise<Trip> {
    const trip = this.tripRepository.create(dto);
    return this.tripRepository.save(trip);
  }

  async findAllTrips(date?: string): Promise<Trip[]> {
    const qb = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('trip.driver', 'driver')
      .orderBy('trip.tripDate', 'DESC');
    if (date) qb.where('trip.tripDate = :date', { date });
    return qb.getMany();
  }

  async findTripById(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['bus', 'driver', 'supervisor'],
    });
    if (!trip) throw new NotFoundException(`Trip ${id} not found`);
    return trip;
  }

  async findActiveTrips(): Promise<Trip[]> {
    return this.tripRepository.find({
      where: { status: TripStatus.IN_PROGRESS },
      relations: ['bus', 'driver'],
    });
  }

  async startTrip(id: string): Promise<Trip> {
    const trip = await this.findTripById(id);
    trip.status = TripStatus.IN_PROGRESS;
    trip.actualStartTime = new Date();
    return this.tripRepository.save(trip);
  }

  async endTrip(id: string): Promise<Trip> {
    const trip = await this.findTripById(id);
    trip.status = TripStatus.COMPLETED;
    trip.actualEndTime = new Date();
    return this.tripRepository.save(trip);
  }

  async updateTripStatus(id: string, status: TripStatus): Promise<Trip> {
    const trip = await this.findTripById(id);
    trip.status = status;
    return this.tripRepository.save(trip);
  }

  async findDriverTrips(driverId: string, date?: string): Promise<Trip[]> {
    const qb = this.tripRepository.createQueryBuilder('trip')
      .where('trip.driverId = :driverId', { driverId })
      .leftJoinAndSelect('trip.bus', 'bus')
      .orderBy('trip.tripDate', 'DESC');
    if (date) qb.andWhere('trip.tripDate = :date', { date });
    return qb.getMany();
  }
}