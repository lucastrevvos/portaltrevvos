import { CreatePostDto } from './create-post.dto';
import { PostStatus } from '@prisma/client';
declare const UpdatePostDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePostDto>>;
export declare class UpdatePostDto extends UpdatePostDto_base {
    slug?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    status?: PostStatus;
    categoryIds?: string[];
    tagIds?: string[];
}
export {};
