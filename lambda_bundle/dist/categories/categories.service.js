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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const slugify_1 = require("../common/utils/slugify");
const client_1 = require("@prisma/client");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const slug = (0, slugify_1.slugify)(dto.name);
        try {
            return await this.prisma.category.create({
                data: { name: dto.name, slug },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Categoria já existe (slug ou nome único).');
            }
            throw error;
        }
    }
    async findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
            // include: {posts: true}
        });
    }
    async findBySlug(slug) {
        const cat = await this.prisma.category.findUnique({ where: { slug } });
        if (!cat)
            throw new common_1.NotFoundException('Categoria não encontrada');
        return cat;
    }
    async update(id, dto) {
        const data = { ...dto };
        if (dto.name)
            data.slug = (0, slugify_1.slugify)(dto.name);
        try {
            return await this.prisma.category.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    throw new common_1.NotFoundException('Categoria não encontrada.');
                if (error.code === 'P2002')
                    throw new common_1.ConflictException('Slug já está em uso.');
            }
        }
    }
    async remove(id) {
        try {
            await this.prisma.category.delete({ where: { id } });
            return { ok: true };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    throw new common_1.NotFoundException('Categoria não encontrada');
                throw error;
            }
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map