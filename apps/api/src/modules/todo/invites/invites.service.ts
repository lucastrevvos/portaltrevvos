import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTodoInviteDto } from './dto/create-invite.dto';
import { addDays } from 'date-fns';
import { randomBytes } from 'node:crypto';
import { TodoInviteRole, TodoMemberRole } from '@prisma/client';

@Injectable()
export class TodoInvitesService {
  constructor(private prisma: PrismaService) {}

  private async getMembershipRoleOrThrow(listId: string, guestId: string) {
    const membership = await this.prisma.todoListMember.findUnique({
      where: { listId_guestId: { listId, guestId } },
      select: { role: true },
    });
    if (!membership) throw new ForbiddenException('Not a member of this list');
    return membership.role;
  }

  private assertCanInvite(role: TodoMemberRole) {
    if (role === TodoMemberRole.VIEWER) {
      throw new ForbiddenException('Insufficient role');
    }
  }

  private baseInviteUrl(token: string) {
    const base =
      (process.env.WEB_ORIGIN?.split(',')?.[0] ??
        process.env.ALLOWED_ORIGIN ??
        'https://trevvos.com.br')?.trim() || 'https://trevvos.com.br';
    const normalized = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${normalized}/todo/invite/${token}`;
  }

  private generateToken() {
    // URL-safe token
    return randomBytes(24).toString('base64url');
  }

  async createInvite(guestId: string, listId: string, dto: CreateTodoInviteDto) {
    const role = await this.getMembershipRoleOrThrow(listId, guestId);
    this.assertCanInvite(role);

    const now = new Date();
    const expiresAt = addDays(now, dto.expiresInDays ?? 30);
    const maxUses = dto.maxUses ?? 50;
    const inviteRole = dto.role ?? TodoInviteRole.EDITOR;

    for (let attempt = 0; attempt < 5; attempt++) {
      const token = this.generateToken();
      try {
        const invite = await this.prisma.todoInvite.create({
          data: {
            listId,
            token,
            role: inviteRole,
            expiresAt,
            maxUses,
            createdByGuestId: guestId,
          },
          select: {
            token: true,
            role: true,
            expiresAt: true,
            maxUses: true,
            uses: true,
            revoked: true,
            listId: true,
          },
        });

        return {
          ...invite,
          inviteUrl: this.baseInviteUrl(invite.token),
        };
      } catch (e: any) {
        // token collision (unique)
        if (e?.code === 'P2002') continue;
        throw e;
      }
    }

    throw new BadRequestException('Could not generate invite token');
  }

  async getInvitePublic(token: string) {
    const invite = await this.prisma.todoInvite.findUnique({
      where: { token },
      select: {
        token: true,
        role: true,
        expiresAt: true,
        maxUses: true,
        uses: true,
        revoked: true,
        list: {
          select: { id: true, title: true },
        },
      },
    });

    if (!invite) throw new NotFoundException('Invite not found');

    const now = new Date();
    const isExpired = invite.expiresAt.getTime() <= now.getTime();
    const remainingUses = Math.max(0, invite.maxUses - invite.uses);

    return {
      token: invite.token,
      role: invite.role,
      expiresAt: invite.expiresAt,
      revoked: invite.revoked,
      isExpired,
      remainingUses,
      list: invite.list,
    };
  }

  async joinInvite(guestId: string, token: string) {
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const invite = await tx.todoInvite.findUnique({
        where: { token },
        select: {
          token: true,
          role: true,
          expiresAt: true,
          maxUses: true,
          uses: true,
          revoked: true,
          list: { select: { id: true, title: true } },
        },
      });
      if (!invite) throw new NotFoundException('Invite not found');
      if (invite.revoked) throw new ForbiddenException('Invite revoked');
      if (invite.expiresAt.getTime() <= now.getTime()) {
        throw new ForbiddenException('Invite expired');
      }
      if (invite.uses >= invite.maxUses) {
        throw new ForbiddenException('Invite max uses reached');
      }

      const existingMembership = await tx.todoListMember.findUnique({
        where: {
          listId_guestId: { listId: invite.list.id, guestId },
        },
        select: { role: true, joinedAt: true },
      });

      if (existingMembership) {
        return {
          list: invite.list,
          role: existingMembership.role,
          alreadyMember: true,
        };
      }

      // ensure guest exists (join can happen before /guest/bootstrap)
      await tx.todoGuest.upsert({
        where: { id: guestId },
        create: { id: guestId, lastSeenAt: now },
        update: { lastSeenAt: now },
      });

      const memberRole: TodoMemberRole =
        invite.role === TodoInviteRole.EDITOR
          ? TodoMemberRole.EDITOR
          : TodoMemberRole.VIEWER;

      const membership = await tx.todoListMember.create({
        data: {
          listId: invite.list.id,
          guestId,
          role: memberRole,
        },
        select: { role: true, joinedAt: true },
      });

      await tx.todoInvite.update({
        where: { token },
        data: { uses: { increment: 1 } },
        select: { token: true },
      });

      await tx.todoList.update({
        where: { id: invite.list.id },
        data: { updatedAt: now },
        select: { id: true },
      });

      return {
        list: invite.list,
        role: membership.role,
        alreadyMember: false,
      };
    });
  }

  async revokeInvite(guestId: string, listId: string, token: string) {
    const role = await this.getMembershipRoleOrThrow(listId, guestId);

    const invite = await this.prisma.todoInvite.findUnique({
      where: { token },
      select: { listId: true, createdByGuestId: true, revoked: true },
    });
    if (!invite || invite.listId !== listId) {
      throw new NotFoundException('Invite not found');
    }

    const canRevoke =
      role === TodoMemberRole.OWNER || invite.createdByGuestId === guestId;
    if (!canRevoke) throw new ForbiddenException('Insufficient role');

    if (invite.revoked) return { ok: true, revoked: true };

    await this.prisma.todoInvite.update({
      where: { token },
      data: { revoked: true },
      select: { token: true },
    });

    return { ok: true, revoked: true };
  }
}

