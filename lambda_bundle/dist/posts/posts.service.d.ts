import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostsDto } from './dto/filter-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { JwtPayload } from '../auth/jwt-payload';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(authorId: string, dto: CreatePostDto): Promise<{
        author: {
            id: string;
            email: string;
            password: string | null;
            name: string | null;
            role: import("@prisma/client").$Enums.GlobalRole;
            createdAt: Date;
            updatedAt: Date;
        };
        categories: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            categoryId: string;
            postId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            tagId: string;
            postId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        coverImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        authorId: string;
        publishedAt: Date | null;
    }>;
    findAll(filter: FilterPostsDto, user?: JwtPayload): Promise<({
        author: {
            id: string;
            email: string;
            password: string | null;
            name: string | null;
            role: import("@prisma/client").$Enums.GlobalRole;
            createdAt: Date;
            updatedAt: Date;
        };
        categories: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            categoryId: string;
            postId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            tagId: string;
            postId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        coverImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        authorId: string;
        publishedAt: Date | null;
    })[]>;
    findOne(id: string): Promise<{
        author: {
            id: string;
            email: string;
            password: string | null;
            name: string | null;
            role: import("@prisma/client").$Enums.GlobalRole;
            createdAt: Date;
            updatedAt: Date;
        };
        categories: {
            categoryId: string;
            postId: string;
        }[];
        tags: {
            tagId: string;
            postId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        coverImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        authorId: string;
        publishedAt: Date | null;
    }>;
    update(id: string, dto: UpdatePostDto, user: JwtPayload): Promise<{
        author: {
            id: string;
            email: string;
            password: string | null;
            name: string | null;
            role: import("@prisma/client").$Enums.GlobalRole;
            createdAt: Date;
            updatedAt: Date;
        };
        categories: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            categoryId: string;
            postId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            tagId: string;
            postId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string;
        coverImage: string | null;
        status: import("@prisma/client").$Enums.PostStatus;
        authorId: string;
        publishedAt: Date | null;
    }>;
    delete(id: string): Promise<{
        ok: boolean;
    }>;
}
