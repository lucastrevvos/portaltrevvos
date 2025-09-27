import { PostStatus } from '@prisma/client';
export declare class FilterPostsDto {
    authorId?: string;
    slug?: string;
    status?: PostStatus;
    categoryId?: string;
    tagId?: string;
    q?: string;
    skip?: number;
    take?: number;
}
