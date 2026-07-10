import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsUUID,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+628123456789' })
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/)
  customerPhone: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ example: '2026-12-20' })
  @IsDateString()
  bookingDate: string;

  @ApiProperty({ example: '14:00:00', description: 'HH:mm:ss (24-hour)' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  bookingTime: string;

  @ApiProperty({ required: false, example: 'Please call before arrival' })
  @IsOptional()
  @IsString()
  notes?: string;
}
