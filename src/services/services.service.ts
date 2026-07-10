import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingStatus } from '../bookings/enums/booking-status.enum';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly servicesRepository: Repository<ServiceEntity>,
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
  ) {}

  create(dto: CreateServiceDto, userId: string) {
    const entity = this.servicesRepository.create({
      ...dto,
      price: dto.price.toFixed(2),
      createdById: userId,
    });
    return this.servicesRepository.save(entity);
  }

  async findAll(query: { page?: number; limit?: number; isActive?: boolean }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);

    const [items, total] = await this.servicesRepository.findAndCount({
      where: query.isActive === undefined ? {} : { isActive: query.isActive },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: items,
      meta: { page, limit, total },
    };
  }

  async findOne(id: string) {
    const entity = await this.servicesRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('Service not found');
    }

    return entity;
  }

  async update(id: string, dto: UpdateServiceDto) {
    const entity = await this.findOne(id);

    const merged = this.servicesRepository.merge(entity, {
      ...dto,
      price: dto.price !== undefined ? dto.price.toFixed(2) : entity.price,
    });

    return this.servicesRepository.save(merged);
  }

  async remove(id: string) {
    await this.findOne(id);

    const activeBookingCount = await this.bookingsRepository.count({
      where: {
        serviceId: id,
        status: BookingStatus.PENDING,
      },
    });

    if (activeBookingCount > 0) {
      throw new ConflictException(
        'Cannot delete service with pending bookings. Cancel bookings first.',
      );
    }

    await this.servicesRepository.delete(id);
    return { message: 'Service deleted successfully' };
  }
}
