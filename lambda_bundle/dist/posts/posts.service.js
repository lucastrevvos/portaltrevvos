"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PostsService = class PostsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(authorId, dto) {
        const { categoryIds = [], tagIds = [], status = 'DRAFT', ...data } = dto;
        const payload = {
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
    async findAll(filter, user) {
        const appSlug = process.env.APP_SLUG || 'portal';
        const appRole = user?.apps?.[appSlug];
        const canSeeDrafts = user?.globalRole === 'ADMIN' ||
            (appRole &&
                ['EDITOR', 'ADMIN', 'OWNER'].includes(appRole));
        // visibilidade
        let baseWhere = {};
        if (!canSeeDrafts) {
            const visibility = [
                { status: client_1.PostStatus.PUBLISHED },
            ];
            if (user?.sub) {
                visibility.push({
                    AND: [{ status: client_1.PostStatus.DRAFT }, { authorId: user.sub }],
                });
            }
            baseWhere = { OR: visibility };
        }
        // filtros “diretos”
        const where = {
            ...baseWhere,
            ...(filter.authorId ? { authorId: filter.authorId } : {}),
            ...(filter.slug ? { slug: filter.slug } : {}),
            ...(canSeeDrafts && filter.status ? { status: filter.status } : {}),
            ...(filter.categoryId
                ? { categories: { some: { categoryId: filter.categoryId } } }
                : {}),
            ...(filter.tagId ? { tags: { some: { tagId: filter.tagId } } } : {}),
        };
        // 🔎 bloco de busca (case-insensitive) — título, resumo, conteúdo, categoria, tag, autor
        let finalWhere = where;
        if (filter.q && filter.q.trim()) {
            const term = filter.q.trim();
            const searchOr = [
                { title: { contains: term, mode: 'insensitive' } },
                { excerpt: { contains: term, mode: 'insensitive' } },
                { content: { contains: term, mode: 'insensitive' } },
                {
                    categories: {
                        some: {
                            category: { name: { contains: term, mode: 'insensitive' } },
                        },
                    },
                },
                {
                    tags: {
                        some: { tag: { name: { contains: term, mode: 'insensitive' } } },
                    },
                },
                { author: { name: { contains: term, mode: 'insensitive' } } },
            ];
            // ✅ combina SEM quebrar a visibilidade (AND entre where atual e OR da busca)
            finalWhere = { AND: [where, { OR: searchOr }] };
        }
        // paginação
        const take = filter.take && filter.take > 0 && filter.take <= 100 ? filter.take : 50;
        const skip = filter.skip && filter.skip >= 0 ? filter.skip : 0;
        return this.prisma.post.findMany({
            where: finalWhere,
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
    async findOne(id) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: { categories: true, tags: true, author: true },
        });
        if (!post)
            throw new common_1.NotFoundException('Post não encontrado');
        return post;
    }
    async update(id, dto, user) {
        const { categoryIds, tagIds, status, ...data } = dto;
        // (opcional) valida se o post existe — retorna 404 elegante
        const exists = await this.prisma.post.findUnique({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException('Post não encontrado');
        const appSlug = process.env.APP_SLUG || 'portal';
        const appRole = user.apps?.[appSlug] ?? '';
        const canPublish = user.globalRole === 'ADMIN' ||
            ['EDITOR', 'ADMIN', 'OWNER'].includes(appRole);
        const updateData = { ...data };
        if (typeof status !== 'undefined') {
            if (!canPublish) {
                //sem permissão: ignora mudança de status (ou lance ForbiddenException se preferir)
                throw new common_1.ForbiddenException('Sem permissão para alterar status');
            }
            else {
                updateData.status = status;
                if (status === 'PUBLISHED')
                    updateData.publishedAt = new Date();
                if (status === 'DRAFT')
                    updateData.publishedAt = null;
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
    async delete(id) {
        const exists = await this.prisma.post.findUnique({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException('Post não encontrado');
        await this.prisma.post.delete({ where: { id } });
        return { ok: true };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map