import { PostStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class FilterPostsDto {
  // Filtros básicos
  @IsOptional()
  @IsString()
  authorId?: string; // cuid no seu schema

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus; // só é aplicado se canSeeDrafts=true

  // Relacionamentos
  @IsOptional()
  @IsUUID()
  categoryId?: string; // Category.id é uuid()

  @IsOptional()
  @IsString()
  tagId?: string; // Tag.id é cuid()

  // Paginação
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number = 50;
}
