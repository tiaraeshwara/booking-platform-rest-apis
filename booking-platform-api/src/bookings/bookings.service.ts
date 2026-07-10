import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository } from 'typeorm';
import { ServiceEntity } from '../services/entities/service.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Booking } from './entities/booking.entity';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  private readonly statusTransitions: Record<BookingStatus, BookingStatus[]> = {
    [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    [BookingStatus.CONFIRMED]: [
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.CANCELLED]: [],
    [BookingStatus.COMPLETED]: [],
  };

  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectRepository(ServiceEntity)
    private readonly servicesRepository: Repository<ServiceEntity>,
  ) {}

  private assertNotPastDate(bookingDate: string, bookingTime: string): void {
    const normalizedTime =
      bookingTime.length === 5 ? `${bookingTime}:00` : bookingTime;
    const bookingDateTime = new Date(`${bookingDate}T${normalizedTime}`);

    if (Number.isNaN(bookingDateTime.getTime())) {
      throw new BadRequestException('Invalid booking date/time');
    }

    if (bookingDateTime < new Date()) {
      throw new BadRequestException('Booking date/time cannot be in the past');
    }
  }

  async create(dto: CreateBookingDto) {
    const service = await this.servicesRepository.findOne({
      where: { id: dto.serviceId },
    });

    if (!service || !service.isActive) {
      throw new NotFoundException('Service not found or inactive');
    }

    this.assertNotPastDate(dto.bookingDate, dto.bookingTime);

    const duplicate = await this.bookingsRepository.findOne({
      where: {
        serviceId: dto.serviceId,
        bookingDate: dto.bookingDate,
        bookingTime:
          dto.bookingTime.length === 5
            ? `${dto.bookingTime}:00`
            : dto.bookingTime,
        status: Not(BookingStatus.CANCELLED),
      },
    });

    if (duplicate) {
      throw new ConflictException('This service slot is already booked');
    }

    const entity = this.bookingsRepository.create({
      ...dto,
      bookingTime:
        dto.bookingTime.length === 5
          ? `${dto.bookingTime}:00`
          : dto.bookingTime,
      status: BookingStatus.PENDING,
    });

    return this.bookingsRepository.save(entity);
  }

  async findAll(query: QueryBookingDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);

    const qb = this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service')
      .orderBy('booking.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.status) {
      qb.andWhere('booking.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb
            .where('booking.customerName ILIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('booking.customerEmail ILIKE :search', {
              search: `%${query.search}%`,
            });
        }),
      );
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      meta: { page, limit, total },
    };
  }

  async findOne(id: string) {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['service'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const booking = await this.findOne(id);

    const allowedStatuses = this.statusTransitions[booking.status];
    if (!allowedStatuses.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${booking.status} to ${dto.status}`,
      );
    }

    booking.status = dto.status;
    return this.bookingsRepository.save(booking);
  }

  async cancel(id: string) {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Completed bookings cannot be cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookingsRepository.save(booking);
  }
}
