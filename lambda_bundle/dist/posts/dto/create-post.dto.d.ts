import { PostStatus } from '@prisma/client';
export declare class CreatePostDto {
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    status?: PostStatus;
    categoryIds?: string[];
    tagIds?: string[];
}
