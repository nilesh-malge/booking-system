import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

interface CreateBookingBody {
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  notes?: string;
  serviceId: number;
}

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'STAFF')
  create(
    @Body() body: CreateBookingBody,
    @Headers('Idempotency-Key') idempotencyKey: string | undefined,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.bookingsService.create({
      ...body,
      userId: req.user.id,
      idempotencyKey,
    });
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'STAFF')
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'STAFF')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(Number(id));
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'MANAGER')
  updateStatus(
    @Param('id') id: string,
    @Body('status')
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  ) {
    return this.bookingsService.updateStatus(Number(id), status);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(Number(id));
  }
}
