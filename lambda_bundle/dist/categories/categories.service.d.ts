import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        slug: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
    }[]>;
    findBySlug(slug: string): Promise<{
        id: string;
        name: string;
        slug: string;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        slug: string;
    } | undefined>;
    remove(id: string): Promise<{
        ok: boolean;
    } | undefined>;
}
