import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    customerName: string;
    customerEmail: string;
    bookingDate: string;
    notes?: string;
    userId: number;
    serviceId: number;
  }) {
    return this.prisma.booking.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        bookingDate: new Date(data.bookingDate),
        notes: data.notes,
        userId: data.userId,
        serviceId: data.serviceId,
      },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        service: true,
      },
      orderBy: {
        bookingDate: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        service: true,
      },
    });
  }

  async updateStatus(
    id: number,
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  ) {
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
