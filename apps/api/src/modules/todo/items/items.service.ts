import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';

@Injectable()
export class TodoItemsService {
  constructor(private prisma: PrismaService) {}

  private async getMembershipRoleOrThrow(listId: string, guestId: string) {
    const membership = await this.prisma.todoListMember.findUnique({
      where: {
        listId_guestId: {
          listId,
          guestId,
        },
      },
      select: { role: true },
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this list');
    }

    return membership.role;
  }

  private assertCanEdit(role: string) {
    if (role === 'VIEWER') {
      throw new ForbiddenException('Insufficient role');
    }
  }

  async listItems(guestId: string, listId: string) {
    await this.getMembershipRoleOrThrow(listId, guestId);

    return this.prisma.todoItem.findMany({
      where: { listId },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        listId: true,
        text: true,
        isDone: true,
        position: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        updatedByGuestId: true,
      },
    });
  }

  async createItem(guestId: string, listId: string, dto: CreateTodoItemDto) {
    const role = await this.getMembershipRoleOrThrow(listId, guestId);
    this.assertCanEdit(role);

    const text = dto.text.trim();
    if (!text) throw new BadRequestException('Text is required');

    const now = new Date();

    const position =
      dto.position ??
      (
        await this.prisma.todoItem.findFirst({
          where: { listId },
          orderBy: { position: 'desc' },
          select: { position: true },
        })
      )?.position ??
      -1;

    const finalPosition = dto.position ?? position + 1;

    return this.prisma.$transaction(async (tx) => {
      const item = await tx.todoItem.create({
        data: {
          listId,
          text,
          position: finalPosition,
          updatedByGuestId: guestId,
          updatedAt: now,
        },
        select: {
          id: true,
          listId: true,
          text: true,
          isDone: true,
          position: true,
          version: true,
          createdAt: true,
          updatedAt: true,
          updatedByGuestId: true,
        },
      });

      await tx.todoList.update({
        where: { id: listId },
        data: { updatedAt: now },
        select: { id: true },
      });

      return item;
    });
  }

  async updateItem(
    guestId: string,
    listId: string,
    itemId: string,
    dto: UpdateTodoItemDto,
  ) {
    const role = await this.getMembershipRoleOrThrow(listId, guestId);
    this.assertCanEdit(role);

    const existing = await this.prisma.todoItem.findFirst({
      where: { id: itemId, listId },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Item not found');

    const data: Record<string, any> = {};
    let hasChange = false;

    if (dto.text !== undefined) {
      const text = dto.text.trim();
      if (!text) throw new BadRequestException('Text cannot be empty');
      data.text = text;
      hasChange = true;
    }

    if (dto.isDone !== undefined) {
      data.isDone = dto.isDone;
      hasChange = true;
    }

    if (dto.position !== undefined) {
      data.position = dto.position;
      hasChange = true;
    }

    if (!hasChange) {
      throw new BadRequestException('No changes provided');
    }

    const now = new Date();
    data.updatedAt = now;
    data.updatedByGuestId = guestId;
    data.version = { increment: 1 };

    return this.prisma.$transaction(async (tx) => {
      const item = await tx.todoItem.update({
        where: { id: itemId },
        data,
        select: {
          id: true,
          listId: true,
          text: true,
          isDone: true,
          position: true,
          version: true,
          createdAt: true,
          updatedAt: true,
          updatedByGuestId: true,
        },
      });

      await tx.todoList.update({
        where: { id: listId },
        data: { updatedAt: now },
        select: { id: true },
      });

      return item;
    });
  }

  async deleteItem(guestId: string, listId: string, itemId: string) {
    const role = await this.getMembershipRoleOrThrow(listId, guestId);
    this.assertCanEdit(role);

    const existing = await this.prisma.todoItem.findFirst({
      where: { id: itemId, listId },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Item not found');

    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      await tx.todoItem.delete({ where: { id: itemId } });
      await tx.todoList.update({
        where: { id: listId },
        data: { updatedAt: now },
        select: { id: true },
      });
    });

    return { ok: true };
  }
}
