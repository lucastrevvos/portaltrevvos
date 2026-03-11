import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TodoGuestService {
  constructor(private prisma: PrismaService) {}

  async bootstrap(guestId: string) {
    const existing = await this.prisma.todoGuest.findUnique({
      where: { id: guestId },
    });

    if (!existing) {
      await this.prisma.todoGuest.create({
        data: { id: guestId, lastSeenAt: new Date() },
      });
      return { guestId, created: true };
    }

    await this.prisma.todoGuest.update({
      where: { id: guestId },
      data: { lastSeenAt: new Date() },
    });

    return { guestId, created: false };
  }
}
