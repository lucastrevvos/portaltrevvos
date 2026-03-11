import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TodoListsService {
  constructor(private prisma: PrismaService) {}

  private async ensureGuest(guestId: string) {
    // garante que o guest existe (FK safe)
    return this.prisma.todoGuest.upsert({
      where: { id: guestId },
      update: { lastSeenAt: new Date() },
      create: { id: guestId },
      select: { id: true },
    });
  }

  async createSharedList(guestId: string, title: string) {
    const t = title.trim();
    if (!t) throw new ForbiddenException('Title is required');

    // ✅ garante guest antes de usar como FK
    await this.ensureGuest(guestId);

    // cria lista + membership OWNER (atomic via nested write)
    const list = await this.prisma.todoList.create({
      data: {
        title: t,
        ownerGuestId: guestId,
        members: {
          create: {
            guestId,
            role: 'OWNER',
          },
        },
      },
      select: { id: true, title: true, createdAt: true },
    });

    return list;
  }

  async listMySharedLists(guestId: string) {
    // ✅ opcional, mas recomendado: se o cara nunca bootstrapou, não quebra
    await this.ensureGuest(guestId);

    const memberships = await this.prisma.todoListMember.findMany({
      where: { guestId },
      orderBy: { joinedAt: 'desc' },
      select: {
        role: true,
        list: {
          select: { id: true, title: true, updatedAt: true, createdAt: true },
        },
      },
    });

    return memberships.map((m) => ({
      id: m.list.id,
      title: m.list.title,
      role: m.role,
      createdAt: m.list.createdAt,
      updatedAt: m.list.updatedAt,
    }));
  }
}