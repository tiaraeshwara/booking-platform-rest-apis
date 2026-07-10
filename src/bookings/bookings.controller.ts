import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { BookingsService } from './bookings.service';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create booking (public endpoint)' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List bookings with pagination/filter/search' })
  findAll(@Query() query: QueryBookingDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by id' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update booking status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.bookingsService.updateStatus(id, dto);
  }

  @Patch(':id/cancel')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel booking' })
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}
