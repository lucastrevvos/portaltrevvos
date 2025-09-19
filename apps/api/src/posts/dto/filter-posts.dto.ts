import { PostStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
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

  // 🔎 termo de busca
  @IsOptional() @IsString() q?: string;

  // Paginação
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  take?: number = 20;
}
