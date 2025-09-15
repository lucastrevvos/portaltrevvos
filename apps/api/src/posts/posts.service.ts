import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostsDto } from './dto/filter-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { JwtPayload } from 'src/auth/jwt-payload';
import { PostStatus, type AppRole, type Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, dto: CreatePostDto) {
    const { categoryIds = [], tagIds = [], status = 'DRAFT', ...data } = dto;

    const payload: any = {
      ...data,
      authorId,
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      categories: categoryIds.length
        ? { create: categoryIds.map((id) => ({ categoryId: id })) }
        : undefined,
      tags: tagIds.length
        ? { create: tagIds.map((id) => ({ tagId: id })) }
        : undefined,
    };

    return this.prisma.post.create({
      data: payload,
      include: {
        author: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });
  }

  async findAll(filter: FilterPostsDto, user?: JwtPayload) {
    const appSlug = process.env.APP_SLUG || 'portal';
    const appRole = user?.apps?.[appSlug];
    const canSeeDrafts =
      user?.globalRole === 'ADMIN' ||
      (appRole &&
        (['EDITOR', 'ADMIN', 'OWNER'] as AppRole[]).includes(appRole));

    // --- Monte os filtros de visibilidade passo a passo (evita inferência ruim) ---
    let baseWhere: Prisma.PostWhereInput = {};
    if (!canSeeDrafts) {
      const visibility: Prisma.PostWhereInput[] = [];
      // público sempre vê publicados
      visibility.push({ status: PostStatus.PUBLISHED });
      // autor logado também vê seus rascunhos
      if (user?.sub) {
        visibility.push({
          AND: [{ status: PostStatus.DRAFT }, { authorId: user.sub }],
        });
      }
      baseWhere = { OR: visibility };
    }

    // --- Aplique filtros do DTO sem perder a visibilidade ---
    const where: Prisma.PostWhereInput = {
      ...baseWhere,
      ...(filter.authorId ? { authorId: filter.authorId } : {}),
      ...(filter.slug ? { slug: filter.slug } : {}),
      // status só é respeitado se pode ver rascunhos
      ...(canSeeDrafts && filter.status ? { status: filter.status } : {}),
      ...(filter.categoryId
        ? { categories: { some: { categoryId: filter.categoryId } } }
        : {}),
      ...(filter.tagId ? { tags: { some: { tagId: filter.tagId } } } : {}),
    };

    // Paginação
    const take =
      filter.take && filter.take > 0 && filter.take <= 100 ? filter.take : 50;
    const skip = filter.skip && filter.skip >= 0 ? filter.skip : 0;

    return this.prisma.post.findMany({
      where,
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        author: true,
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take,
      skip,
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { categories: true, tags: true, author: true },
    });

    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }

  async update(id: string, dto: UpdatePostDto, user: JwtPayload) {
    const { categoryIds, tagIds, status, ...data } = dto;

    // (opcional) valida se o post existe — retorna 404 elegante
    const exists = await this.prisma.post.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Post não encontrado');

    const appSlug = process.env.APP_SLUG || 'portal';
    const appRole = user.apps?.[appSlug] ?? '';
    const canPublish =
      user.globalRole === 'ADMIN' ||
      ['EDITOR', 'ADMIN', 'OWNER'].includes(appRole as any);

    const updateData: any = { ...data };

    if (typeof status !== 'undefined') {
      if (!canPublish) {
        //sem permissão: ignora mudança de status (ou lance ForbiddenException se preferir)
        throw new ForbiddenException('Sem permissão para alterar status');
      } else {
        updateData.status = status;
        if (status === 'PUBLISHED') updateData.publishedAt = new Date();
        if (status === 'DRAFT') updateData.publishedAt = null;
      }
    }

    // 4) aplicar update (somente altera relações quando arrays foram enviadas)

    return this.prisma.post.update({
      where: { id },
      data: {
        ...updateData,

        ...(Array.isArray(categoryIds)
          ? {
              categories: {
                deleteMany: {}, // limpa vínculos existentes
                create: categoryIds.map((categoryId) => ({ categoryId })),
              },
            }
          : {}),

        ...(Array.isArray(tagIds)
          ? {
              tags: {
                deleteMany: {},
                create: tagIds.map((tagId) => ({ tagId })),
              },
            }
          : {}),
      },
      include: {
        author: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });
  }

  async delete(id: string) {
    const exists = await this.prisma.post.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Post não encontrado');
    await this.prisma.post.delete({ where: { id } });

    return { ok: true };
  }
}
