import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
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
    idempotencyKey?: string;
  }) {
    // Preserve existing behavior when no Idempotency-Key is provided
    if (!data.idempotencyKey) {
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

    // Fast path: return the existing booking for this user/key
    const existingBooking = await this.prisma.booking.findUnique({
      where: {
        userId_idempotencyKey: {
          userId: data.userId,
          idempotencyKey: data.idempotencyKey,
        },
      },
    });

    if (existingBooking) {
      return existingBooking;
    }

    try {
      // The database unique constraint protects this insert from
      // concurrent requests using the same user + idempotency key.
      return await this.prisma.booking.create({
        data: {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          bookingDate: new Date(data.bookingDate),
          notes: data.notes,
          userId: data.userId,
          serviceId: data.serviceId,
          idempotencyKey: data.idempotencyKey,
        },
      });
    } catch (error) {
      // If another concurrent request created the booking first,
      // PostgreSQL rejects this insert with a unique constraint error.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return this.prisma.booking.findUniqueOrThrow({
          where: {
            userId_idempotencyKey: {
              userId: data.userId,
              idempotencyKey: data.idempotencyKey,
            },
          },
        });
      }

      throw error;
    }
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
