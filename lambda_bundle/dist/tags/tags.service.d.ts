import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTagDto): Promise<{
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
    update(id: string, dto: UpdateTagDto): Promise<{
        id: string;
        name: string;
        slug: string;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
