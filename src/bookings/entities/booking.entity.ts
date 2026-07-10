import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceEntity } from '../../services/entities/service.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity('bookings')
@Index(['serviceId', 'bookingDate', 'bookingTime'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerPhone: string;

  @ManyToOne(() => ServiceEntity, (service) => service.bookings, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column({ type: 'uuid' })
  serviceId: string;

  @Column({ type: 'date' })
  bookingDate: string;

  @Column({ type: 'time' })
  bookingTime: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
