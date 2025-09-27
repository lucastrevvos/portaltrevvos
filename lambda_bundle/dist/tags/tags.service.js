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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const slugify_1 = require("../common/utils/slugify");
let TagsService = class TagsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const slug = (0, slugify_1.slugify)(dto.name);
        try {
            return await this.prisma.tag.create({
                data: { name: dto.name, slug },
            });
        }
        catch (e) {
            if (e.code === 'P2002') {
                throw new common_1.ConflictException('Tag já existe (slug ou nome único).');
            }
            throw e;
        }
    }
    async findAll() {
        return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
    }
    async findBySlug(slug) {
        const tag = await this.prisma.tag.findUnique({ where: { slug } });
        if (!tag)
            throw new common_1.NotFoundException('Tag não encontrada.');
        return tag;
    }
    async update(id, dto) {
        const data = { ...dto };
        if (dto.name)
            data.slug = (0, slugify_1.slugify)(dto.name);
        try {
            return await this.prisma.tag.update({ where: { id }, data });
        }
        catch (e) {
            if (e.code === 'P2025')
                throw new common_1.NotFoundException('Tag não encontrada.');
            if (e.code === 'P2002')
                throw new common_1.ConflictException('Slug já está em uso.');
            throw e;
        }
    }
    async remove(id) {
        try {
            await this.prisma.tag.delete({ where: { id } });
            return { ok: true };
        }
        catch (e) {
            if (e.code === 'P2025')
                throw new common_1.NotFoundException('Tag não encontrada.');
            throw e;
        }
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagsService);
//# sourceMappingURL=tags.service.js.map