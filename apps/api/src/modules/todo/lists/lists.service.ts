import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TodoListsService {
  constructor(private prisma: PrismaService) {}

  private async ensureGuest(guestId: string) {
    return this.prisma.todoGuest.upsert({
      where: { id: guestId },
      update: { lastSeenAt: new Date() },
      create: { id: guestId },
      select: { id: true },
    });
  }

  async leaveList(guestId: string, listId: string) {
    console.log('Membership check for guestId', guestId, 'and listId', listId);
    await this.ensureGuest(guestId);

    const membership = await this.prisma.todoListMember.findUnique({
      where: {
        listId_guestId: {
          listId,
          guestId,
        },
      },
      select: {
        guestId: true,
        listId: true,
        role: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('Você não participa desta lista');
    }

    if (membership.role === 'OWNER') {
      throw new ForbiddenException('O dono da lista não pode sair dela');
    }

    await this.prisma.todoListMember.delete({
      where: {
        listId_guestId: {
          listId,
          guestId,
        },
      },
    });

    return { success: true };
  }

  async deleteList(guestId: string, listId: string) {
    await this.ensureGuest(guestId);

    const membership = await this.prisma.todoListMember.findUnique({
      where: {
        listId_guestId: {
          listId,
          guestId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!membership || membership.role !== 'OWNER') {
      throw new ForbiddenException('Apenas o dono da lista pode deletá-la');
    }

    await this.prisma.todoList.delete({
      where: { id: listId },
    });

    return { success: true };
  }

  async createSharedList(guestId: string, title: string) {
    const t = title.trim();
    if (!t) {
      throw new ForbiddenException('Title is required');
    }

    await this.ensureGuest(guestId);

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
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    return list;
  }

  async listMySharedLists(guestId: string) {
    await this.ensureGuest(guestId);

    const memberships = await this.prisma.todoListMember.findMany({
      where: { guestId },
      orderBy: { joinedAt: 'desc' },
      select: {
        role: true,
        list: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
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
